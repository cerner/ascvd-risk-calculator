const ASCVDRisk = jest.genMockFromModule('./load_fhir_data');

const dob = new Date(1939, 7, 30);

ASCVDRisk.patientInfo = {
  'age': 77,
  'dateOfBirth': dob,
  'gender': 'male',
  'relatedFactors': {
    'diabetic': false,
    'race': 'white',
    'smoker': true
  },
  'systolicBloodPressure': 150,
};

ASCVDRisk.hideDemoBanner = false;
ASCVDRisk.computeTenYearScore = jest.fn(() => 33);
ASCVDRisk.computeLowestTenYear = jest.fn(() => 10);
ASCVDRisk.computeLifetimeRisk = jest.fn(() => 35);
ASCVDRisk.computeLowestLifetime = jest.fn(() => 5);
ASCVDRisk.computePotentialRisk = jest.fn(() => 20);
ASCVDRisk.canCalculateScore = jest.fn(() => true);
ASCVDRisk.missingFields = jest.fn();
ASCVDRisk.isValidAge = jest.fn(() => true);
ASCVDRisk.isValidTotalCholesterol = jest.fn(() => false);
ASCVDRisk.isValidSysBP = jest.fn(() => true);
ASCVDRisk.isValidHDL = jest.fn(() => true);
ASCVDRisk.computeBirthDateFromAge = jest.fn();

module.exports = ASCVDRisk;
