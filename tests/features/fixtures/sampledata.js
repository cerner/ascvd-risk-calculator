const thisDate = new Date();
const age = 50;

const ASCVDRisk = {
  patientInfo: {
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    age: age,
    dateOfBirth: new Date(thisDate.getFullYear() - age, thisDate.getMonth(), thisDate.getDate()),
    totalCholesterol: 150,
    hdl: 30,
    systolicBloodPressure: 170,
    relatedFactors: {
      smoker: true,
      hypertensive: true,
      race: 'aa',
      diabetic: undefined,
    },
  },
  hideBanner: false,
};

/**
 * Method to calculate age from the provided date of birth considering leapYear.
 * @param birthDate - Date of birth in Date Object format
 * @returns {number} - Age calculated
 */
const computeAgeFromBirthDate = (birthDate) => {
  function isLeapYear(year) {
    return new Date(year, 1, 29).getMonth() === 1;
  }

  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  birthDate.setFullYear(birthDate.getFullYear() + years);
  if (birthDate > now) {
    years -= 1;
    birthDate.setFullYear(birthDate.getFullYear() - 1);
  }
  const days = (now.getTime() - birthDate.getTime()) / (3600 * 24 * 1000);
  return Math.floor(years + (days / (isLeapYear(now.getFullYear()) ? 366 : 365)));
};
ASCVDRisk.computeAgeFromBirthDate = computeAgeFromBirthDate;

/**
 * Method to calculate birth date from the provided age considering leapYear.
 * @param age - Age to calculate a birth date from
 * @returns {Date} - Date calculated
 */
const computeBirthDateFromAge = (age) => {
  const now = new Date();
  const estBirthYear = now.getFullYear() - age;
  const birthMonth = ASCVDRisk.patientInfo.dateOfBirth.getMonth();
  const birthDate = ASCVDRisk.patientInfo.dateOfBirth.getDate();
  const newBirthDate = new Date(estBirthYear, birthMonth, birthDate);
  const computedAge = ASCVDRisk.computeAgeFromBirthDate(new Date(newBirthDate.valueOf()));
  if (computedAge === age) {
    return newBirthDate;
  } else if (computedAge < age) {
    return new Date(estBirthYear - 1, birthMonth, birthDate);
  }
  return new Date(estBirthYear + 1, birthMonth, birthDate);
};
ASCVDRisk.computeBirthDateFromAge = computeBirthDateFromAge;

/**
 * Processes labs fetched. Fetches subsequent available pages until we have
 * values for all the labs.
 * @param labsByLoinc : function to fetch array of observations given loinc codes.
 */
const processLabsData = (labsByLoincs) => {
  ASCVDRisk.hasObservationWithUnsupportedUnits = false;

  PatientInfo.totalCholesterol = ASCVDRisk.getCholesterolValue(labsByLoincs('14647-2', '2093-3'));
  PatientInfo.hdl = ASCVDRisk.getCholesterolValue(labsByLoincs('2085-9'));
  PatientInfo.systolicBloodPressure = ASCVDRisk.getSystolicBloodPressureValue(labsByLoincs('55284-4'));
  PatientInfo.relatedFactors.smoker = ASCVDRisk.getSmokerStatus(labsByLoincs('72166-2', '229819007'));
};
ASCVDRisk.processLabsData = processLabsData;

/**
 * Fetches smoker status from patient
 * @param smokingObservations - Observation results returned for smoking status
 * @returns {*} - A default for the patient's smoking status if retrieved
 *                successfully or left undefined
 */
const getSmokerStatus = (smokingObservations) => {
  const data = smokingObservations.sort((a, b) => Date.parse(b.issued) - Date.parse(a.issued));
  const currentSmokerSnomeds = ['449868002', '428041000124106', '428071000124103',
    '428061000124105', '77176002'];
  const notSmokerSnomeds = ['8517006', '266919005'];
  for (let i = 0; i < data.length; i += 1) {
    if ((data[i].status.toLowerCase() === 'final' || data[i].status.toLowerCase() === 'amended') &&
      data[i].valueCodeableConcept && data[i].valueCodeableConcept.coding
      && data[i].valueCodeableConcept.coding[0].code) {
      if (currentSmokerSnomeds.indexOf(data[i].valueCodeableConcept.coding[0].code) > -1) {
        return true;
      } else if (notSmokerSnomeds.indexOf(data[i].valueCodeableConcept.coding[0].code) > -1) {
        return false;
      }
    }
  }
  return undefined;
};
ASCVDRisk.getSmokerStatus = getSmokerStatus;

/**
 * Fetches current cholesterol into units of mg/dL
 * @method getCholesterolValue
 * @param {object} cholesterolObservations - Cholesterol array object with
 *                                           valueQuantity elements having units and value.
 */
const getCholesterolValue = cholesterolObservations => (
  ASCVDRisk.getFirstValidDataValue(cholesterolObservations, (dataPoint) => {
    if (dataPoint.valueQuantity.unit === 'mg/dL') {
      return parseFloat(dataPoint.valueQuantity.value);
    } else if (dataPoint.valueQuantity.unit === 'mmol/L') {
      return parseFloat(dataPoint.valueQuantity.value) / 0.026;
    }
    return undefined;
  }));
ASCVDRisk.getCholesterolValue = getCholesterolValue;

/**
 * Fetches current Systolic Blood Pressure
 * @method getSystolicBloodPressureValue
 * @param {object} sysBPObservations - sysBloodPressure array object with
 *                                     valueQuantity elements having units and value
 */
const getSystolicBloodPressureValue = (sysBPObservations) => {
  const formattedObservations = [];
  sysBPObservations.forEach((observation) => {
    const sysBP = observation.component.find(component => component.code.coding.find(coding => coding.code === '8480-6'));
    if (sysBP) {
      const newObservation = Object.assign({}, observation);
      newObservation.valueQuantity = sysBP.valueQuantity;
      formattedObservations.push(newObservation);
    }
  });
  return ASCVDRisk.getFirstValidDataValue(Object.assign([], formattedObservations), (data) => {
    if (data.valueQuantity.unit === 'mm[Hg]' || data.valueQuantity.unit === 'mmHg') {
      return parseFloat(data.valueQuantity.value);
    }
    return undefined;
  });
};
ASCVDRisk.getSystolicBloodPressureValue = getSystolicBloodPressureValue;

/**
 * Fetches the most recent valid dataPointValue from the observations .
 * Validity criteria :
 * 1. status : 'final' or 'amended'
 * 2. availability of the valueQuantity field having value and units
 * 3. units are supported.
 * @param observations : Array of observations to be used to find the valid dataPoint
 * @param supportedUnitsCriteria : Criteria function supplied to be used for
 *                                 every dataPoint.
 * @returns dataPointValue : Single observation value which meets the criteria. If
 *                           no dataPointValue is valid then undefined is returned
 *                           to fetch further more results.
 */
const getFirstValidDataValue = (observations, supportedUnitsCriteria) => {
  const dataPoints = ASCVDRisk.sortObservationsByTime(observations);
  for (let i = 0; i < dataPoints.length; i += 1) {
    if ((dataPoints[i].status.toLowerCase() === 'final' || dataPoints[i].status.toLowerCase() === 'amended') &&
      {}.hasOwnProperty.call(dataPoints[i], 'valueQuantity') && dataPoints[i].valueQuantity.value &&
      dataPoints[i].valueQuantity.unit) {
      const dataPointValue = supportedUnitsCriteria(dataPoints[i]);
      if (dataPointValue !== undefined) {
        return dataPointValue;
      }

      // We set this flag here to process later (once all pages have been scanned
      // for a valid dataPoint) to convey to the user about unsupported units
      ASCVDRisk.hasObservationWithUnsupportedUnits = true;
      ASCVDRisk.unsupportedUnitDataPoint = dataPoints[i];
    } else {
      // We collect this information to log in case if the user
      // does not have a required unit
      ASCVDRisk.unsupportedObservationStructureDataPoint = dataPoints[i];
    }
  }
  return undefined;
};
ASCVDRisk.getFirstValidDataValue = getFirstValidDataValue;

/**
 * Sorting function to sort observations based on the time stamp returned.
 * Sorting is done to get most recent date first.
 * @param labsToSort : Array of observations to sort
 * @returns labsToSort : Returns the sorted array.
 */
const sortObservationsByTime = (labs) => {
  labs.sort((a, b) => Date.parse(b.effectiveDateTime) - Date.parse(a.effectiveDateTime));
  return labs;
};
ASCVDRisk.sortObservationsByTime = sortObservationsByTime;

/**
 * Checks if the ASCVDRisk data model has the required labs available.
 * @returns {boolean} : Indicating if required labs are available.
 */
const areRequiredLabsNotAvailable = () => {
  if (PatientInfo.totalCholesterol === undefined || PatientInfo.hdl === undefined
    || PatientInfo.systolicBloodPressure === undefined) {
    return true;
  }
  return false;
};
ASCVDRisk.areRequiredLabsNotAvailable = areRequiredLabsNotAvailable;

/**
 * Computes the ASCVD Risk Estimate for an individual over the next 10 years.
 * @param patientInfo - patientInfo object from ASCVDRisk data model
 * @returns {*} Returns the risk score or null if not in the appropriate age range
 */
const computeTenYearScore = (patientInfo) => {
  if (patientInfo.age < 40 || patientInfo.age > 79) { return null; }
  const lnAge = Math.log(patientInfo.age);
  const lnTotalChol = Math.log(patientInfo.totalCholesterol);
  const lnHdl = Math.log(patientInfo.hdl);
  const trlnsbp = patientInfo.relatedFactors.hypertensive ?
    Math.log(parseFloat(patientInfo.systolicBloodPressure)) : 0;
  const ntlnsbp = patientInfo.relatedFactors.hypertensive ?
    0 : Math.log(parseFloat(patientInfo.systolicBloodPressure));
  const ageTotalChol = lnAge * lnTotalChol;
  const ageHdl = lnAge * lnHdl;
  const agetSbp = lnAge * trlnsbp;
  const agentSbp = lnAge * ntlnsbp;
  const ageSmoke = patientInfo.relatedFactors.smoker ? lnAge : 0;

  const isAA = patientInfo.relatedFactors.race === 'aa';
  const isMale = patientInfo.gender === 'male';
  let s010Ret = 0;
  let mnxbRet = 0;
  let predictRet = 0;

  const calculateScore = () => {
    if (isAA && !isMale) {
      s010Ret = 0.95334;
      mnxbRet = 86.6081;
      predictRet = (17.1141 * lnAge) + (0.9396 * lnTotalChol) + (-18.9196 * lnHdl)
        + (4.4748 * ageHdl) + (29.2907 * trlnsbp) + (-6.4321 * agetSbp) + (27.8197 * ntlnsbp) +
        (-6.0873 * agentSbp) + (0.6908 * Number(patientInfo.relatedFactors.smoker))
        + (0.8738 * Number(patientInfo.relatedFactors.diabetic));
    } else if (!isAA && !isMale) {
      s010Ret = 0.96652;
      mnxbRet = -29.1817;
      predictRet = (-29.799 * lnAge) + (4.884 * (lnAge ** 2)) + (13.54 * lnTotalChol) +
        (-3.114 * ageTotalChol) + (-13.578 * lnHdl) + (3.149 * ageHdl) + (2.019 * trlnsbp) +
        (1.957 * ntlnsbp) + (7.574 * Number(patientInfo.relatedFactors.smoker)) +
        (-1.665 * ageSmoke) + (0.661 * Number(patientInfo.relatedFactors.diabetic));
    } else if (isAA && isMale) {
      s010Ret = 0.89536;
      mnxbRet = 19.5425;
      predictRet = (2.469 * lnAge) + (0.302 * lnTotalChol) + (-0.307 * lnHdl) +
        (1.916 * trlnsbp) + (1.809 * ntlnsbp) + (0.549 *
        Number(patientInfo.relatedFactors.smoker)) +
        (0.645 * Number(patientInfo.relatedFactors.diabetic));
    } else {
      s010Ret = 0.91436;
      mnxbRet = 61.1816;
      predictRet = (12.344 * lnAge) + (11.853 * lnTotalChol) + (-2.664 * ageTotalChol) +
        (-7.99 * lnHdl) + (1.769 * ageHdl) + (1.797 * trlnsbp) + (1.764 * ntlnsbp) +
        (7.837 * Number(patientInfo.relatedFactors.smoker)) + (-1.795 * ageSmoke) +
        (0.658 * Number(patientInfo.relatedFactors.diabetic));
    }

    const pct = (1 - (s010Ret ** Math.exp(predictRet - mnxbRet)));
    return Math.round((pct * 100) * 10) / 10;
  };
  return calculateScore();
};
ASCVDRisk.computeTenYearScore = computeTenYearScore;

/**
 * Computes the lifetime ASCVD Risk Estimate for an individual. If the individual
 * is younger than 20 or older than 59, the lifetime risk cannot be estimated.
 * @param patientInfo - patientInfo object from ASCVDRisk data model
 * @returns {*} Returns the risk score or null if not in the appropriate age range
 */
const computeLifetimeRisk = (patientInfo) => {
  if (patientInfo.age < 20 || patientInfo.age > 59) { return null; }
  let ascvdRisk = 0;
  const params = {
    male: {
      major2: 69,
      major1: 50,
      elevated: 46,
      notOptimal: 36,
      allOptimal: 5,
    },
    female: {
      major2: 50,
      major1: 39,
      elevated: 39,
      notOptimal: 27,
      allOptimal: 8,
    },
  };

  const major = (patientInfo.totalCholesterol >= 240 ? 1 : 0) +
    ((patientInfo.systolicBloodPressure >= 160 ? 1 : 0) +
    (patientInfo.relatedFactors.hypertensive ? 1 : 0)) +
    (patientInfo.relatedFactors.smoker ? 1 : 0) +
    (patientInfo.relatedFactors.diabetic ? 1 : 0);
  const elevated = ((((patientInfo.totalCholesterol >= 200 &&
    patientInfo.totalCholesterol < 240) ? 1 : 0) +
    ((patientInfo.systolicBloodPressure >= 140 &&
    patientInfo.systolicBloodPressure < 160 &&
    patientInfo.relatedFactors.hypertensive === false) ? 1 : 0)) >= 1 ? 1 : 0) *
    (major === 0 ? 1 : 0);
  const allOptimal = (((patientInfo.totalCholesterol < 180 ? 1 : 0) +
    ((patientInfo.systolicBloodPressure < 120 ? 1 : 0) *
    (patientInfo.relatedFactors.hypertensive ? 0 : 1))) === 2 ? 1 : 0) *
    (major === 0 ? 1 : 0);
  const notOptimal = ((((patientInfo.totalCholesterol >= 180 &&
  patientInfo.totalCholesterol < 200) ? 1 : 0) +
  ((patientInfo.systolicBloodPressure >= 120 &&
  patientInfo.systolicBloodPressure < 140 &&
  patientInfo.relatedFactors.hypertensive === false) ? 1 : 0)) *
  (elevated === 0 ? 1 : 0) * (major === 0 ? 1 : 0)) >= 1 ? 1 : 0;

  if (major > 1) { ascvdRisk = params[patientInfo.gender].major2; }
  if (major === 1) { ascvdRisk = params[patientInfo.gender].major1; }
  if (elevated === 1) { ascvdRisk = params[patientInfo.gender].elevated; }
  if (notOptimal === 1) { ascvdRisk = params[patientInfo.gender].notOptimal; }
  if (allOptimal === 1) { ascvdRisk = params[patientInfo.gender].allOptimal; }

  return ascvdRisk;
};
ASCVDRisk.computeLifetimeRisk = computeLifetimeRisk;

/**
 * Computes the lowest ASCVD Risk Estimate for an individual over the next
 * 10 years, under best possible conditions
 * @param patientInfo - patientInfo object from ASCVDRisk data model
 * @returns {*} Returns the risk score or null if not in the appropriate age range
 */
const computeLowestTenYear = () => {
  const patientInfoCopy = Object.assign({}, ASCVDRisk.patientInfo);
  patientInfoCopy.systolicBloodPressure = 90;
  patientInfoCopy.totalCholesterol = 130;
  patientInfoCopy.hdl = 100;
  const relatedFactorsCopy = Object.assign({}, ASCVDRisk.patientInfo.relatedFactors);
  relatedFactorsCopy.diabetic = false;
  relatedFactorsCopy.smoker = false;
  relatedFactorsCopy.hypertensive = false;
  patientInfoCopy.relatedFactors = relatedFactorsCopy;
  return ASCVDRisk.computeTenYearScore(patientInfoCopy);
};
ASCVDRisk.computeLowestTenYear = computeLowestTenYear;

/**
 * Computes the lowest ASCVD Risk Estimate for an individual over a lifetime, under best possible
 * conditions
 * @param patientInfo - patientInfo object from ASCVDRisk data model
 * @returns {*} Returns the risk score or null if not in the appropriate age range
 */
const computeLowestLifetime = () => {
  const patientInfoCopy = Object.assign({}, ASCVDRisk.patientInfo);
  patientInfoCopy.systolicBloodPressure = 90;
  patientInfoCopy.totalCholesterol = 130;
  patientInfoCopy.hdl = 100;
  const relatedFactorsCopy = Object.assign({}, ASCVDRisk.patientInfo.relatedFactors);
  relatedFactorsCopy.diabetic = false;
  relatedFactorsCopy.smoker = false;
  relatedFactorsCopy.hypertensive = false;
  patientInfoCopy.relatedFactors = relatedFactorsCopy;
  return ASCVDRisk.computeLifetimeRisk(patientInfoCopy);
};
ASCVDRisk.computeLowestLifetime = computeLowestLifetime;

/**
 * Computes an amount to reduce current risk score by
 * certain reductions potentially impacting the score:
 *  statin - 25% reduction
 *  sysBP - 30% reduction for every 10 mmHg in Systolic Blood Pressure down to 140 mmHg
 *  aspirin - 10% reduction
 *  smoker - 15% reduction
 *
 * If the current score reduced by the total amount of reductions surpasses the lowest
 * possible risk score, the method will only return an amount to reduce to the lowest
 * possible risk score.
 *
 * @param reductions - Array of reductions to indicate which reductions to consider
 * @param score - String to indicate which type of risk score to impact
 * @returns {*} Returns the amount to reduce the current risk score by
 *              or null if not in the appropriate age range
 */
const computePotentialRisk = (reductions, score) => {
  let computedScore;
  let lowestScore;
  let reducedTotalScore = 0;
  if (score === 'ten') {
    computedScore = ASCVDRisk.computeTenYearScore(ASCVDRisk.patientInfo);
    lowestScore = ASCVDRisk.computeLowestTenYear();
  } else {
    computedScore = ASCVDRisk.computeLifetimeRisk(ASCVDRisk.patientInfo);
    lowestScore = ASCVDRisk.computeLowestLifetime();
  }
  for (let i = 0; i < reductions.length; i += 1) {
    if (reductions[i] === 'statin') {
      reducedTotalScore += (computedScore * 0.25);
    } else if (reductions[i] === 'sysBP') {
      const sysBPCalculation = computedScore - (computedScore *
        (0.7 ** ((ASCVDRisk.patientInfo.systolicBloodPressure - 140) / 10)));
      reducedTotalScore += sysBPCalculation;
    } else if (reductions[i] === 'aspirin') {
      reducedTotalScore += (computedScore * 0.1);
    } else if (reductions[i] === 'smoker') {
      reducedTotalScore += (computedScore * 0.15);
    }
  }
  if (Math.round((computedScore - reducedTotalScore) * 10) / 10 <= lowestScore) {
    return Math.round((computedScore - lowestScore) * 10) / 10;
  }
  return Math.round(reducedTotalScore * 10) / 10;
};
ASCVDRisk.computePotentialRisk = computePotentialRisk;

/**
 * Validates the provided age value for bounds and availability.
 * @param currentVal : Value for age
 * @returns {boolean} Indicates if the age value is valid.
 */
const isValidAge = (currentVal) => {
  if (!isNaN(currentVal) && currentVal !== undefined && currentVal >= 20 && currentVal <= 79) {
    return true;
  }
  return false;
};
ASCVDRisk.isValidAge = isValidAge;

/**
 * Validates the provided systolic blood pressure value for bounds and availability.
 * @param currentVal : Value for systolic blood pressure
 * @returns {boolean} Indicates if the systolic blood pressure value is valid.
 */
const isValidSysBP = (currentVal) => {
  if (!isNaN(currentVal) && currentVal !== undefined && currentVal >= 90 && currentVal <= 200) {
    return true;
  }
  return false;
};
ASCVDRisk.isValidSysBP = isValidSysBP;

/**
 * Validates the provided HDL value for bounds and availability.
 * @param currentVal : Value for HDL
 * @returns {boolean} Indicates if the HDL value is valid.
 */
const isValidHDL = (currentVal) => {
  if (!isNaN(currentVal) && currentVal !== undefined && currentVal >= 20 && currentVal <= 100) {
    return true;
  }
  return false;
};
ASCVDRisk.isValidHDL = isValidHDL;

/**
 * Validates the provided total cholesterol value for bounds and availability.
 * @param currentVal : Value for total cholesterol
 * @returns {boolean} Indicates if the total cholesterol value is valid.
 */
const isValidTotalCholesterol = (currentVal) => {
  if (!isNaN(currentVal) && currentVal !== undefined && currentVal >= 130 && currentVal <= 320) {
    return true;
  }
  return false;
};
ASCVDRisk.isValidTotalCholesterol = isValidTotalCholesterol;

/**
 * Checks if the ASCVD data model has sufficient data to compute ASCVD score.
 * Checks for :
 *   1. Systolic Blood Pressure
 *   2. Age
 *   3. Total Cholesterol
 *   4. HDL
 *   5. Hypertensive status
 *   6. Race
 *   7. Diabetic status
 *   8. Smoker status
 *   9. Gender
 * @returns {boolean} Indicating if ASCVD Estimate can be calculated.
 */
const canCalculateScore = () => {
  if (ASCVDRisk.isValidSysBP(ASCVDRisk.patientInfo.systolicBloodPressure) &&
    ASCVDRisk.isValidAge(ASCVDRisk.patientInfo.age) &&
    ASCVDRisk.isValidTotalCholesterol(ASCVDRisk.patientInfo.totalCholesterol) &&
    ASCVDRisk.isValidHDL(ASCVDRisk.patientInfo.hdl) &&
    ASCVDRisk.patientInfo.relatedFactors.hypertensive !== undefined &&
    ASCVDRisk.patientInfo.relatedFactors.race !== undefined &&
    ASCVDRisk.patientInfo.relatedFactors.diabetic !== undefined &&
    ASCVDRisk.patientInfo.relatedFactors.smoker !== undefined &&
    ASCVDRisk.patientInfo.gender !== undefined) {
    return true;
  }
  return false;
};
ASCVDRisk.canCalculateScore = canCalculateScore;

/**
 * Checks for missing user information to calculate a risk score and displays
 * an appropriate message containing missing fields
 * @returns {*} Message containing missing information to calculate a valid risk score
 */
const missingFields = () => {
  const needInput = [];
  if (!ASCVDRisk.isValidTotalCholesterol(ASCVDRisk.patientInfo.totalCholesterol)) {
    needInput.push('formTotalCholesterol');
  }
  if (ASCVDRisk.patientInfo.relatedFactors.diabetic === undefined) {
    needInput.push('formDiabetic');
  }
  if (!ASCVDRisk.isValidAge(ASCVDRisk.patientInfo.age)) {
    needInput.push('formAge');
  }
  if (!ASCVDRisk.isValidHDL(ASCVDRisk.patientInfo.hdl)) {
    needInput.push('formHdl');
  }
  if (ASCVDRisk.patientInfo.relatedFactors.smoker === undefined) {
    needInput.push('formSmoker');
  }
  if (ASCVDRisk.patientInfo.relatedFactors.race === undefined) {
    needInput.push('formRace');
  }
  if (!ASCVDRisk.isValidSysBP(ASCVDRisk.patientInfo.systolicBloodPressure)) {
    needInput.push('formSysBP');
  }
  if (ASCVDRisk.patientInfo.relatedFactors.hypertensive === undefined) {
    needInput.push('formHypertensive');
  }
  if (ASCVDRisk.patientInfo.gender === undefined) {
    needInput.push('formSex');
  }
  return needInput;
};
ASCVDRisk.missingFields = missingFields;

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}

if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

module.exports = ASCVDRisk;
