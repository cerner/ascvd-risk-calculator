import { expect, assert } from 'chai';
import ASCVDRisk from '../../app/load_fhir_data';
import Canadarm from 'canadarm';
import sinon from 'sinon';
import $ from '../../lib/jquery.min';

describe ('ASCVDRisk', () => {
  describe('setDefaultPatient', () => {
    it('sets a default patient with undefined fields', () => {
      const patientModel = {
        firstName: undefined,
        lastName: undefined,
        gender: undefined,
        dateOfBirth: undefined,
        age: undefined,
        hdl: undefined,
        relatedFactors: {
          diabetic: undefined,
          hypertensive: undefined,
          race: undefined,
          smoker: undefined
        },
        systolicBloodPressure: undefined,
        totalCholesterol: undefined
      };

      const retSpy = sinon.spy(ASCVDRisk.ret, 'resolve');
      ASCVDRisk.setDefaultPatient();

      retSpy.restore();
      sinon.assert.calledWith(retSpy, patientModel);
      expect(ASCVDRisk.hideDemoBanner).to.equal(true);
    });
  });

  describe('onError', () => {
    it('sets a default patient to allow the application to run', () => {
      const spyASCVDRisk = sinon.spy(ASCVDRisk, 'setDefaultPatient');
      const mockCanadarm = sinonSandbox.mock(Canadarm);
      mockCanadarm.expects('error').once().returns('');
      ASCVDRisk.onError();

      spyASCVDRisk.restore();
      sinon.assert.calledOnce(spyASCVDRisk);
      mockCanadarm.verify();
    });
  });

  describe('onReady', () => {
    let mockToken;
    let mockPatient;
    const loincCodes = loincCode => {};

    beforeEach(() => {
      mockPatient = {
        name: [{
          given: { join: () => 'Joe ' },
          family: { join: () => 'Show ' },
        }],
        gender: 'm',
        birthDate: '1965-02-01'
      };
      mockToken = {
        tokenResponse: {
          need_patient_banner: 'true'
        },
        patient: {
          read: (() => mockPatient),
          api: {
            fetchAll: (() => true)
          }
        },
        byCodes: (() => loincCodes)
      };
    });

    it('sets a valid patient model for a valid patient and valid information pulled in', () => {
      const patientModel = {
        firstName: 'Joe ',
        lastName: 'Show ',
        gender: 'm',
        dateOfBirth: new Date('1965/02/01'),
        age: 52,
        hdl: 45,
        relatedFactors: {
          diabetic: undefined,
          hypertensive: undefined,
          race: undefined,
          smoker: true
        },
        systolicBloodPressure: 111,
        totalCholesterol: 240
      };
      const mockASCVDRisk = sinonSandbox.mock(ASCVDRisk);
      mockASCVDRisk.expects('getCholesterolValue').once().withExactArgs(loincCodes('14647-2', '2093-3')).returns(240);
      mockASCVDRisk.expects('getCholesterolValue').once().withExactArgs(loincCodes('2085-9')).returns(45);
      mockASCVDRisk.expects('getSystolicBloodPressureValue').once().withExactArgs(loincCodes('8480-6')).returns(111);
      mockASCVDRisk.expects('getSmokerStatus').once().withExactArgs(loincCodes('72166-2', '229819007')).returns(true);
      mockASCVDRisk.expects('areRequiredLabsNotAvailable').once().returns(false);

      const retSpy = sinon.spy(ASCVDRisk.ret, 'resolve');
      ASCVDRisk.onReady(mockToken);

      retSpy.restore();
      sinon.assert.calledWith(retSpy, patientModel);

      expect(ASCVDRisk.hideDemoBanner).to.equal(false);

      mockASCVDRisk.verify();
    });

    it('calls to set a default patient model for invalid patient data pulled in', () => {
      mockToken = {
        tokenResponse: {
          need_patient_banner: 'true'
        },
        patient: {
          read: (() => $.Deferred().reject({
            status: 404,
            statusText: "Nope"
          })),
          api: {
            fetchAll: (() => $.Deferred().reject({
              status: 404,
              statusText: "Nope"
            }))
          }
        }
      };

      const spyASCVDRisk = sinon.spy(ASCVDRisk, 'setDefaultPatient');
      const mockCanadarm = sinonSandbox.mock(Canadarm);
      mockCanadarm.expects('error').once().returns('');
      ASCVDRisk.onReady(mockToken);

      spyASCVDRisk.restore();
      sinon.assert.calledOnce(spyASCVDRisk);
      mockCanadarm.verify();
    });

    it('calls to set a default patient model when a patient cannot be pulled in', () => {
      mockToken = {
        tokenResponse: {
          need_patient_banner: 'true'
        },
      };

      const spyASCVDRisk = sinon.spy(ASCVDRisk, 'setDefaultPatient');
      const mockCanadarm = sinonSandbox.mock(Canadarm);
      mockCanadarm.expects('error').once().returns('');
      ASCVDRisk.onReady(mockToken);

      spyASCVDRisk.restore();
      sinon.assert.calledOnce(spyASCVDRisk);
      mockCanadarm.verify();
    });
  });

  describe('fetchPatientData', () => {
    beforeEach(() => {
      const FHIR = {
        oauth2: {
          ready: (() => true)
        },
      };
      global.FHIR = FHIR;
      window.FHIR = FHIR;

      global.canadarmConfig = {
        canadarm_beacon_url: true
      };
      window.canadarmConfig = {
        canadarm_beacon_url: true
      };
    });

    it('handles the FHIR oauth2 sequence', () => {
      const spyFHIR = sinon.spy(FHIR.oauth2, 'ready');
      const retSpy = sinon.spy(ASCVDRisk.ret, 'promise');

      ASCVDRisk.fetchPatientData();
      spyFHIR.restore();
      sinon.assert.calledOnce(spyFHIR);
      retSpy.restore();
      sinon.assert.calledOnce(retSpy);
    });

    it('calls to initialize the logger before fetching data', () => {
      const loggingSpy = sinon.spy(ASCVDRisk, 'initializeLogger');

      ASCVDRisk.fetchPatientData();
      loggingSpy.restore();
      sinon.assert.calledOnce(loggingSpy);
    });
  });
  describe ('computeAgeFromBirthDate', () => {
    it ('returns number of full years to this date', () => {
      const mockDate = new Date();
      mockDate.setFullYear(mockDate.getFullYear() - 47);
      const retYears = ASCVDRisk.computeAgeFromBirthDate(mockDate);
      expect(retYears).to.equal(47);
    });

    it ('returns number of years minus this past year', () => {
      const mockDate = new Date();
      mockDate.setFullYear(mockDate.getFullYear() - 47);

      if (mockDate.getMonth() === 11) {
        mockDate.setFullYear(mockDate.getFullYear() + 1);
        mockDate.setMonth(0);
      } else {
        mockDate.setMonth(mockDate.getMonth() + 1);
      }
      const retYears = ASCVDRisk.computeAgeFromBirthDate(mockDate);
      expect(retYears).to.equal(46);
    });
  });

  describe ('computeBirthDateFromAge', () => {
    it ('returns a date object from a given age', () => {
      setPatientInfo('male',50,234,44,110,false,false,'white',true,ASCVDRisk.patientInfo);
      const thisDate = new Date();
      const birthDate = ASCVDRisk.computeBirthDateFromAge(50);
      expect(new Date(thisDate.getFullYear() - 50, thisDate.getMonth(),
        thisDate.getDate()).getTime()).to.equal(birthDate.getTime());
    });
  });

  describe ('processLabsData', () => {
    it ('retrieves lab values and sets the flag for unsupported observation units to false', () => {
      const loincCodes = loincCode => {};

      const mockASCVDRisk = sinonSandbox.mock(ASCVDRisk);
      mockASCVDRisk.expects('getCholesterolValue').once().withExactArgs(loincCodes('14647-2', '2093-3')).returns(240);
      mockASCVDRisk.expects('getCholesterolValue').once().withExactArgs(loincCodes('2085-9')).returns(45);
      mockASCVDRisk.expects('getSystolicBloodPressureValue').once().withExactArgs(loincCodes('8480-6')).returns(111);
      mockASCVDRisk.expects('getSmokerStatus').once().withExactArgs(loincCodes('72166-2', '229819007')).returns(true);

      ASCVDRisk.processLabsData(loincCodes);

      expect(ASCVDRisk.hasObservationWithUnsupportedUnits).to.equal(false);
      expect(ASCVDRisk.patientInfo.totalCholesterol).to.equal(240);
      expect(ASCVDRisk.patientInfo.hdl).to.equal(45);
      expect(ASCVDRisk.patientInfo.systolicBloodPressure).to.equal(111);
      expect(ASCVDRisk.patientInfo.relatedFactors.smoker).to.equal(true);

      mockASCVDRisk.verify();
    });
  });

  describe ('getSmokerStatus', () => {
    let mockObservation;
    beforeEach(() => {
      mockObservation = [{
        'issued': "2016-01-15T20:26:00.000Z",
        'status': 'final',
        'valueCodeableConcept': {
          'coding': [
            {
              'code': '449868002',
              'text': 'Current everyday smoker'
            }
          ]
        }
      }];
    });

    it ('retrieves a successful result for defaulting to current smoker status', () => {
      expect(ASCVDRisk.getSmokerStatus(mockObservation)).to.equal(true);
    });

    it ('retrieves a successful result for defaulting to not a current smoker status', () => {
      mockObservation[0].valueCodeableConcept.coding[0].code = '266919005';
      expect(ASCVDRisk.getSmokerStatus(mockObservation)).to.equal(false);
    });

    it ('returns undefined for a successful result in an undetermined smoker status', () => {
      mockObservation[0].valueCodeableConcept.coding[0].code = '266927001';
      expect(ASCVDRisk.getSmokerStatus(mockObservation)).to.equal(undefined);
    });

    it ('returns undefined for an unsuccessful result', () => {
      mockObservation = [{
        'issued': "2016-01-15T20:26:00.000Z",
        'status': 'final'
      }];
      expect(ASCVDRisk.getSmokerStatus(mockObservation)).to.equal(undefined);
    });
  });

  describe ('sortObservationsByTime', () => {
    it ('returns labs in sorted order based on their time stamp', () => {
      const labsToSort = [
        { 'effectiveDateTime' : "2016-01-15T20:26:00.000Z" },
        { 'effectiveDateTime' : "2016-03-07T18:02:00.000Z" },
        { 'effectiveDateTime' : "2016-03-07T14:20:00.000Z" },
        { 'effectiveDateTime' : "2016-03-07T17:14:00.000Z" },
        { 'effectiveDateTime' : "2015-12-16T19:54:00.000Z" } ];

      const expectedResponse = [
        { 'effectiveDateTime' : "2016-03-07T18:02:00.000Z" },
        { 'effectiveDateTime' : "2016-03-07T17:14:00.000Z" },
        { 'effectiveDateTime' : "2016-03-07T14:20:00.000Z" },
        { 'effectiveDateTime' : "2016-01-15T20:26:00.000Z" },
        { 'effectiveDateTime' : "2015-12-16T19:54:00.000Z" } ];
      const response = ASCVDRisk.sortObservationsByTime(labsToSort);

      expect(expectedResponse).to.deep.have.same.members(response);
      for (const x in expectedResponse) {
        expect(expectedResponse[x]).to.deep.equal(response[x]);
      }
    });
  });

  describe ('getCholesterolValue', () => {
    describe ('returns given cholesterol input with value as per units', () => {
      it ('when the cholesterol is in mg/dL', () => {
        const cholesterol = [{
          "valueQuantity" : {
            unit: 'mg/dL',
            value: 238
          },
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'final'
        }];

        expect(ASCVDRisk.getCholesterolValue(cholesterol)).to.equal(238.00);
      });

      it ('when the cholesterol is in mmol/L', () => {
        const cholesterol = [{
          "valueQuantity" : {
            unit: 'mmol/L',
            value: 238
          },
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'amended'
        }];

        expect(ASCVDRisk.getCholesterolValue(cholesterol)).to.equal(parseFloat(238) / 0.026);
      });
    });

    describe ('returns response as undefined for invalid cholesterol input', () => {
      it ('when the cholesterol input has invalid units', () => {
        const cholesterol = [{
          "valueQuantity" : {
            unit: 'mol/L',
            value: 238
          },
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'final'
        }];

        expect(ASCVDRisk.getCholesterolValue(cholesterol)).to.equal(undefined);
      });

      it ('when the cholesterol input is missing the unit field', () => {
        const cholesterol = [{
          "valueQuantity" : {
            value: 238
          },
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'final'
        }];
        expect(ASCVDRisk.getCholesterolValue(cholesterol)).to.equal(undefined);
      });

      it ('when the cholesterol input is an empty array', () => {
        const cholesterol = [];
        expect(ASCVDRisk.getCholesterolValue(cholesterol)).to.equal(undefined);
      });
    });
  });

  describe ('getSystolicBloodPressureValue', () => {
    describe('returns given valid SBP in float value', () => {
      it('when SBP is a valid value in mmHg units', () => {
        const sbp = [{
          component : [{
            code : {
              coding : [{
                code : "8480-6",
                display : "Systolic Blood Pressure",
                system : "http://loinc.org"
              }],
              text : "Systolic Blood Pressure"
            },
            valueQuantity : {
              code : 'mm[Hg]',
              value : 106,
              unit : 'mmHg'
            }
          }],
          effectiveDateTime : "2016-03-07T18:02:00.000Z",
          status : 'final'
        }];
        expect(ASCVDRisk.getSystolicBloodPressureValue(sbp)).to.equal(106.00);
      });

      it('when SBP is a valid value in mm[Hg] units', () => {
        const sbp = [{
          component : [{
            code : {
              coding : [{
                code : "8480-6",
                display : "Systolic Blood Pressure",
                system : "http://loinc.org"
              }],
              text : "Systolic Blood Pressure"
            },
            valueQuantity : {
              code : 'mm[Hg]',
              value : 111,
              unit : 'mm[Hg]'
            }
          }],
          effectiveDateTime : "2016-03-07T18:02:00.000Z",
          status : 'final'
        }];
        expect(ASCVDRisk.getSystolicBloodPressureValue(sbp)).to.equal(111.00);
      });

    });

    describe('returns undefined', () => {
      it('when SBP is an invalid value in mmsHg', () => {
        const sbp = [{
          component : [{
            code : {
              coding : [{
                code : "8480-6",
                system : "http://loinc.org"
              }]
            },
            valueQuantity : {
              code : 'msm[Hg]',
              value : 106,
              unit : 'mmsHg'
            }
          }],
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'final'
        }];

        expect(ASCVDRisk.getSystolicBloodPressureValue(sbp)).to.equal(undefined);
      });

      it('when SBP input is empty array', () => {
        const sbp = [];
        expect(ASCVDRisk.getSystolicBloodPressureValue(sbp)).to.equal(undefined);
      });
    });
  });

  describe ('getFirstValidDataValue', () => {
    it ('checks if sorting was invoked and supported units being blank',() => {
      const mockASCVDRisk = sinonSandbox.mock(ASCVDRisk);
      mockASCVDRisk.expects('sortObservationsByTime').once().withExactArgs([]).returns([]);
      ASCVDRisk.getFirstValidDataValue([],() => {});

      mockASCVDRisk.verify();
    });

    describe('returns a valid data point value', () => {
      let observations;
      beforeEach(() => {
        ASCVDRisk.hasObservationWithUnsupportedUnits = false;
        observations = [{
          "valueQuantity" : {
            unit: 'msg/dL',
            value: 238
          },
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'Final'

        }, {
          "valueQuantity" : {
            unit: 'mm[Hg]',
            value: 119
          },
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'amended'

        }];
      });

      it ('if data has supported units and 1 valid observation', () => {
        const mockASCVDRisk = sinonSandbox.mock(ASCVDRisk);
        mockASCVDRisk.expects('sortObservationsByTime').once().withExactArgs(observations).returns(observations);

        const dataPointValue = ASCVDRisk.getFirstValidDataValue(observations,dataPoint => {
          if (dataPoint.valueQuantity.unit === 'mm[Hg]') {
            return parseFloat(dataPoint.valueQuantity.value);
          }
        });
        expect(dataPointValue).to.equal(parseFloat(observations[1].valueQuantity.value));
        mockASCVDRisk.verify();
      });
    });

    describe('returns undefined', () => {
      let observations;
      beforeEach(() => {
        ASCVDRisk.hasObservationWithUnsupportedUnits = false;
        observations = [{
          "valueQuantity" : {
            unit: 'mg/dL',
            value: 238
          },
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'entered-in-error'

        }];
      });

      it('when status is in error', () => {
        const mockASCVDRisk = sinonSandbox.mock(ASCVDRisk);
        mockASCVDRisk.expects('sortObservationsByTime').once().withExactArgs(observations).returns(observations);

        const dataPointValue = ASCVDRisk.getFirstValidDataValue(observations,() => {});
        expect(dataPointValue).to.equal(undefined);
        mockASCVDRisk.verify();
      });

      it('when valueQuantity is missing', () => {
        observations = [{
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'final'
        }];

        const mockASCVDRisk = sinonSandbox.mock(ASCVDRisk);
        mockASCVDRisk.expects('sortObservationsByTime').once().withExactArgs(observations).returns(observations);

        const dataPoint = ASCVDRisk.getFirstValidDataValue(observations,() => {});
        expect(dataPoint).to.equal(undefined);
        mockASCVDRisk.verify();
      });

      it ('when value is missing', () => {
        observations = [{
          "valueQuantity" : {
            unit: 'mg/dL'
          },
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'final'
        }];

        const mockASCVDRisk = sinonSandbox.mock(ASCVDRisk);
        mockASCVDRisk.expects('sortObservationsByTime').once().withExactArgs(observations).returns(observations);

        const dataPoint = ASCVDRisk.getFirstValidDataValue(observations,() => {});
        expect(dataPoint).to.equal(undefined);
        mockASCVDRisk.verify();
      });

      it ('when units are missing', () => {
        observations = [{
          "valueQuantity" : {
            value: 238
          },
          "effectiveDateTime" : "2016-03-07T18:02:00.000Z",
          "status" : 'final'
        }];

        const mockASCVDRisk = sinonSandbox.mock(ASCVDRisk);
        mockASCVDRisk.expects('sortObservationsByTime').once().withExactArgs(observations).returns(observations);

        const dataPoint = ASCVDRisk.getFirstValidDataValue(observations,() => {});
        expect(dataPoint).to.equal(undefined);
        mockASCVDRisk.verify();
      });
    });
  });

  describe ('areRequiredLabsNotAvailable', () => {
    it ('returns true when one of the totalCholesterol vitals is undefined', () => {
      setPatientInfo('male',65,undefined,44,110,false,false,'white',true,ASCVDRisk.patientInfo);
      const returnedValue = ASCVDRisk.areRequiredLabsNotAvailable();
      expect(returnedValue).to.equal(true);
    });

    it ('returns true when one of the hdl vitals is undefined', () => {
      setPatientInfo('male',65,345,undefined,110,false,false,'white',true,ASCVDRisk.patientInfo);
      const returnedValue = ASCVDRisk.areRequiredLabsNotAvailable();
      expect(returnedValue).to.equal(true);
    });

    it ('returns true when one of the systolicBloodPressure vitals is undefined', () => {
      setPatientInfo('male',65,345,44,undefined,false,false,'white',true,ASCVDRisk.patientInfo);
      const returnedValue = ASCVDRisk.areRequiredLabsNotAvailable();
      expect(returnedValue).to.equal(true);
    });

    it ('returns false when none of the labs are undefined', () => {
      setPatientInfo('male',65,234,44,110,false,false,'white',true,ASCVDRisk.patientInfo);
      const returnedValue = ASCVDRisk.areRequiredLabsNotAvailable();
      expect(returnedValue).to.equal(false);
    });
  });

  describe ('computeTenYearScore', () => {
    describe ('for invalid patients', () => {
      it('who are younger than 40 yrs old', () => {
        const malePatient = setPatientInfo('male',20,150,40,140,true,true,'white',true,ASCVDRisk.patientInfo);
        assert.equal(null, ASCVDRisk.computeTenYearScore(malePatient));
      });

      it('who are older than 79 yrs old', () => {
        const malePatient = setPatientInfo('male',80,150,40,140,true,true,'white',true,ASCVDRisk.patientInfo);
        assert.equal(null, ASCVDRisk.computeTenYearScore(malePatient));
      });
    });
    describe ('for men', () => {
      it ('who are white or not African American', () => {
        const malePatientWhite = setPatientInfo('male',46,150,40,140,true,true,'white',true,ASCVDRisk.patientInfo);
        const malePatientOther = setPatientInfo('male',46,150,40,140,true,true,'other',true,ASCVDRisk.patientInfo);
        assert.equal(12.2, ASCVDRisk.computeTenYearScore(malePatientWhite));
        assert.equal(12.2, ASCVDRisk.computeTenYearScore(malePatientOther));
      });

      it ('who are African American', () => {
        const malePatientAA = setPatientInfo('male',46,150,40,140,true,true,'aa',true,ASCVDRisk.patientInfo);
        assert.equal(24.9, ASCVDRisk.computeTenYearScore(malePatientAA));
      });
    });

    describe ('for women', () => {
      it ('who are white or not African American', () => {
        const femalePatientWhite = setPatientInfo('female',46,141,34,140,true,true,'white',true,ASCVDRisk.patientInfo);
        const femalePatientOther = setPatientInfo('female',46,141,34,140,true,true,'other',true,ASCVDRisk.patientInfo);
        assert.equal(10.3, ASCVDRisk.computeTenYearScore(femalePatientWhite));
        assert.equal(10.3, ASCVDRisk.computeTenYearScore(femalePatientOther));
      });

      it ('who are African American', () => {
        const femalePatientAA = setPatientInfo('female',46,141,34,140,true,true,'aa',true,ASCVDRisk.patientInfo);
        assert.equal(26.8, ASCVDRisk.computeTenYearScore(femalePatientAA));
      });
    });
  });

  describe ('computeLifetimeRisk', () => {
    describe ('for invalid patients', () => {
      it ('who are 19 yrs old or younger', () => {
        const malePatientAA = setPatientInfo('male',19,150,40,140,true,true,'aa',true,ASCVDRisk.patientInfo);
        assert.equal(null, ASCVDRisk.computeLifetimeRisk(malePatientAA));
      });

      it ('who are 60 years old or older', () => {
        const malePatientAA = setPatientInfo('male',60,150,40,140,true,true,'aa',true,ASCVDRisk.patientInfo);
        assert.equal(null, ASCVDRisk.computeLifetimeRisk(malePatientAA));
      });
    });

    describe ('for valid male patients', () => {
      it ('at higher-tiered major risk', () => {
        const malePatientAA = setPatientInfo('male',40,150,40,140,true,true,'aa',true,ASCVDRisk.patientInfo);
        assert.equal(69, ASCVDRisk.computeLifetimeRisk(malePatientAA));
      });

      it ('at lower-tiered major risk', () => {
        const malePatientAA = setPatientInfo('male',40,150,40,140,false,true,'aa',false,ASCVDRisk.patientInfo);
        assert.equal(50, ASCVDRisk.computeLifetimeRisk(malePatientAA));
      });

      it ('at elevated risk', () => {
        const malePatientAA = setPatientInfo('male',40,150,40,140,false,false,'aa',false,ASCVDRisk.patientInfo);
        assert.equal(46, ASCVDRisk.computeLifetimeRisk(malePatientAA));
      });

      it ('at non-optimal risk', () => {
        const malePatientAA = setPatientInfo('male',40,150,40,120,false,false,'aa',false,ASCVDRisk.patientInfo);
        assert.equal(36, ASCVDRisk.computeLifetimeRisk(malePatientAA));
      });

      it ('at all-optimal conditions', () => {
        const malePatientAA = setPatientInfo('male',40,150,40,110,false,false,'aa',false,ASCVDRisk.patientInfo);
        assert.equal(5, ASCVDRisk.computeLifetimeRisk(malePatientAA));
      });
    });

    describe ('for valid female patients', () => {
      it ('at higher-tiered major risk', () => {
        const femalePatientAA = setPatientInfo('female',40,150,40,140,true,true,'aa',true,ASCVDRisk.patientInfo);
        assert.equal(50, ASCVDRisk.computeLifetimeRisk(femalePatientAA));
      });

      it ('at lower-tiered major risk', () => {
        const femalePatientAA = setPatientInfo('female',40,150,40,140,false,true,'aa',false,ASCVDRisk.patientInfo);
        assert.equal(39, ASCVDRisk.computeLifetimeRisk(femalePatientAA));
      });

      it ('at elevated risk', () => {
        const femalePatientAA = setPatientInfo('female',40,150,40,140,false,false,'aa',false,ASCVDRisk.patientInfo);
        assert.equal(39, ASCVDRisk.computeLifetimeRisk(femalePatientAA));
      });

      it ('at non-optimal risk', () => {
        const femalePatientAA = setPatientInfo('female',40,150,40,120,false,false,'aa',false,ASCVDRisk.patientInfo);
        assert.equal(27, ASCVDRisk.computeLifetimeRisk(femalePatientAA));
      });

      it ('at all-optimal risk', () => {
        const femalePatientAA = setPatientInfo('female',40,150,40,110,false,false,'aa',false,ASCVDRisk.patientInfo);
        assert.equal(8, ASCVDRisk.computeLifetimeRisk(femalePatientAA));
      });
    });
  });

  describe ('computeLowestScores', () => {
    it ('computes the lowest ten year score for a qualifying patient', () => {
      const malePatientWhite = setPatientInfo('male',70,150,40,140,true,true,'white',true,ASCVDRisk.patientInfo);
      assert.equal(5.9, ASCVDRisk.computeLowestTenYear(malePatientWhite));
    });

    it ('computes the lowest lifetime score for a qualifying patient', () => {
      const malePatientWhite = setPatientInfo('male',48,150,40,140,true,true,'white',true,ASCVDRisk.patientInfo);
      assert.equal(5, ASCVDRisk.computeLowestLifetime(malePatientWhite));
    });

    it ('returns null for a lowest ten year score on an unqualified patient', () => {
      const malePatientWhite = setPatientInfo('male',23,150,40,140,true,true,'white',true,ASCVDRisk.patientInfo);
      assert.equal(null, ASCVDRisk.computeLowestTenYear(malePatientWhite));
    });

    it ('returns null for a lowest lifetime score on an unqualified patient', () => {
      const malePatientWhite = setPatientInfo('male',70,150,40,140,true,true,'white',true,ASCVDRisk.patientInfo);
      assert.equal(null, ASCVDRisk.computeLowestLifetime(malePatientWhite));
    });
  });

  describe ('computePotentialRisk', () => {
    let reductions;
    let score;

    describe ('10 Year Score', () => {
      beforeEach(() => {
        reductions = ['statin', 'sysBP', 'aspirin', 'smoker'];
        score = 'ten';
      });

      it ('returns total reduced score', () => {
        setPatientInfo('male',60,150,30,150,true,true,'aa',true,ASCVDRisk.patientInfo);
        assert.equal(39.8, ASCVDRisk.computePotentialRisk(reductions, score));
      });

      it ('returns margin between current and lowest possible score', () => {
        setPatientInfo('male',60,150,30,160,true,false,'aa',false,ASCVDRisk.patientInfo);
        assert.equal(18.0, ASCVDRisk.computePotentialRisk(reductions, score));
      });
    });

    describe ('Lifetime Risk Score', () => {
      beforeEach(() => {
        reductions = ['statin', 'sysBP', 'aspirin', 'smoker'];
        score = 'lifetime';
      });

      it ('returns total reduced score', () => {
        reductions = ['statin', 'aspirin', 'smoker'];
        setPatientInfo('male',23,150,30,140,true,true,'aa',true,ASCVDRisk.patientInfo);
        assert.equal(34.5, ASCVDRisk.computePotentialRisk(reductions, score));
      });

      it ('returns margin between current and lowest possible score', () => {
        setPatientInfo('male',23,150,30,160,true,true,'aa',true,ASCVDRisk.patientInfo);
        assert.equal(64, ASCVDRisk.computePotentialRisk(reductions, score));
      });
    });
  });

  describe ('isValid', () => {
    describe ('vitals are valid', () => {
      it ('returns true if vitals are at their minimum allowed value', () => {
        const responseAge = ASCVDRisk.isValidAge(20);
        const responseSBP = ASCVDRisk.isValidSysBP(90);
        const responseHDL = ASCVDRisk.isValidHDL(20);
        const responseTotalC = ASCVDRisk.isValidTotalCholesterol(130);

        expect(responseAge).to.be.equal(true);
        expect(responseSBP).to.be.equal(true);
        expect(responseHDL).to.be.equal(true);
        expect(responseTotalC).to.be.equal(true);
      });

      it ('returns true if vitals are in-between allowed value range', () => {
        const responseAge = ASCVDRisk.isValidAge(50);
        const responseSBP = ASCVDRisk.isValidSysBP(110);
        const responseHDL = ASCVDRisk.isValidHDL(80);
        const responseTotalC = ASCVDRisk.isValidTotalCholesterol(200);

        expect(responseAge).to.be.equal(true);
        expect(responseSBP).to.be.equal(true);
        expect(responseHDL).to.be.equal(true);
        expect(responseTotalC).to.be.equal(true);
      });

      it ('returns true if vitals are at their maximum allowed value', () => {
        const responseAge = ASCVDRisk.isValidAge(79);
        const responseSBP = ASCVDRisk.isValidSysBP(200);
        const responseHDL = ASCVDRisk.isValidHDL(100);
        const responseTotalC = ASCVDRisk.isValidTotalCholesterol(320);

        expect(responseAge).to.be.equal(true);
        expect(responseSBP).to.be.equal(true);
        expect(responseHDL).to.be.equal(true);
        expect(responseTotalC).to.be.equal(true);
      });
    });

    describe ('vitals are not valid', () => {
      it ('returns false if vitals values are undefined', () => {
        const responseAge = ASCVDRisk.isValidAge(undefined);
        const responseSBP = ASCVDRisk.isValidSysBP(undefined);
        const responseHDL = ASCVDRisk.isValidHDL(undefined);
        const responseTotalC = ASCVDRisk.isValidTotalCholesterol(undefined);

        expect(responseAge).to.be.equal(false);
        expect(responseSBP).to.be.equal(false);
        expect(responseHDL).to.be.equal(false);
        expect(responseTotalC).to.be.equal(false);
      });

      it('it returns false if vitals values are NaN', () => {
        const responseAge = ASCVDRisk.isValidAge('NaN');
        const responseSBP = ASCVDRisk.isValidSysBP('NaN');
        const responseHDL = ASCVDRisk.isValidHDL('NaN');
        const responseTotalC = ASCVDRisk.isValidTotalCholesterol('NaN');

        expect(responseAge).to.be.equal(false);
        expect(responseSBP).to.be.equal(false);
        expect(responseHDL).to.be.equal(false);
        expect(responseTotalC).to.be.equal(false);
      });

      it('it returns false if vitals are below minimum range', () => {
        const responseAge = ASCVDRisk.isValidAge(19);
        const responseSBP = ASCVDRisk.isValidSysBP(89);
        const responseHDL = ASCVDRisk.isValidHDL(19);
        const responseTotalC = ASCVDRisk.isValidTotalCholesterol(129);

        expect(responseAge).to.be.equal(false);
        expect(responseSBP).to.be.equal(false);
        expect(responseHDL).to.be.equal(false);
        expect(responseTotalC).to.be.equal(false);
      });

      it('it returns false if vitals are above maximum range', () => {
        const responseAge = ASCVDRisk.isValidAge(80);
        const responseSBP = ASCVDRisk.isValidSysBP(201);
        const responseHDL = ASCVDRisk.isValidHDL(101);
        const responseTotalC = ASCVDRisk.isValidTotalCholesterol(321);

        expect(responseAge).to.be.equal(false);
        expect(responseSBP).to.be.equal(false);
        expect(responseHDL).to.be.equal(false);
        expect(responseTotalC).to.be.equal(false);
      });
    });
  });

  describe ('canCalculateScore', () => {

    let mock;

    beforeEach(() => {
      mock = sinonSandbox.mock(ASCVDRisk);
    });

    it ('returns true if all values are available', () => {
      setPatientInfo('male',59,160,60,140,false,false,'white',true,ASCVDRisk.patientInfo);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(true);
      mock.verify();
    });

    it ('returns false if we have undefined age', () => {
      setPatientInfo('male',undefined,160,60,160,false,false,'white',true,ASCVDRisk.patientInfo);
      mock.expects("isValidAge").once().returns(false);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(false);
      mock.verify();
    });

    it ('returns false if we have undefined systolic blood pressure', () => {
      setPatientInfo('male',59,160,60,undefined,false,false,'white',true,ASCVDRisk.patientInfo);
      mock.expects("isValidSysBP").once().returns(false);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(false);
      mock.verify();
    });

    it ('returns false if we have undefined HDL', () => {
      setPatientInfo('male',59,160,undefined,140,false,false,'white',true,ASCVDRisk.patientInfo);
      mock.expects("isValidHDL").once().returns(false);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(false);
      mock.verify();
    });

    it ('returns false if we have undefined total cholesterol', () => {
      setPatientInfo('male',59,undefined,70,140,false,false,'white',true,ASCVDRisk.patientInfo);
      mock.expects("isValidTotalCholesterol").once().returns(false);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(false);
      mock.verify();
    });

    it ('returns false if we have undefined smoker status', () => {
      setPatientInfo('male',59,160,60,140,undefined,false,'white',true,ASCVDRisk.patientInfo);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(false);
      mock.verify();
    });

    it ('returns false if we have undefined hypertension status', () => {
      setPatientInfo('male',59,160,60,140,false,undefined,'white',true,ASCVDRisk.patientInfo);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(false);
      mock.verify();
    });

    it ('returns false if we have undefined race status', () => {
      setPatientInfo('male',59,160,60,140,false,false,undefined,true,ASCVDRisk.patientInfo);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(false);
      mock.verify();
    });

    it ('returns false if we have undefined diabetes status', () => {
      setPatientInfo('male',59,160,60,140,false,false,'white',undefined,ASCVDRisk.patientInfo);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(false);
      mock.verify();
    });

    it ('returns false if we have undefined gender', () => {
      setPatientInfo(undefined,45,160,60,160,false,false,'white',true,ASCVDRisk.patientInfo);
      const response = ASCVDRisk.canCalculateScore();

      expect(response).to.be.equal(false);
      mock.verify();
    });
  });

  describe('missingFields', () => {

    let mock;

    beforeEach(() => {
      mock = sinonSandbox.mock(ASCVDRisk);
    });

    it ('returns a full array for all missing input fields', () => {
      setPatientInfo(undefined,undefined,undefined,undefined,undefined,undefined,
        undefined,undefined,undefined,ASCVDRisk.patientInfo);
      mock.expects("isValidTotalCholesterol").once().returns(false);
      mock.expects("isValidAge").once().returns(false);

      expect(ASCVDRisk.missingFields().length).to.be.equal(9);
      mock.verify();
    });

    it ('returns an empty array for all fields completed', () => {
      setPatientInfo('male',59,159,70,140,false,false,'white',true,ASCVDRisk.patientInfo);
      expect(ASCVDRisk.missingFields().length).to.be.equal(0);
      mock.verify();
    });
  });
});

var sinonSandbox;
beforeEach(() => {
  sinonSandbox = sinon.sandbox.create();
});

afterEach(() => {
  sinonSandbox.restore();
});

var setPatientInfo = (gender, age, totCholesterol, hdl, sysBP, smoker, hypertensive, race, diabetic, patientInfo) => {
  if (patientInfo === undefined) patientInfo = {};

  const thisDate = new Date();

  patientInfo.firstName = 'John';
  patientInfo.lastName = 'Doe';
  patientInfo.gender = gender;
  patientInfo.age = age;
  patientInfo.dateOfBirth = new Date(thisDate.getFullYear() - age, thisDate.getMonth(), thisDate.getDate());

  patientInfo.totalCholesterol = totCholesterol;
  patientInfo.hdl = hdl;
  patientInfo.systolicBloodPressure = sysBP;

  const relatedFactors = {};
  relatedFactors.smoker = smoker;
  relatedFactors.hypertensive = hypertensive;
  relatedFactors.race = race;
  relatedFactors.diabetic = diabetic;
  patientInfo.relatedFactors = relatedFactors;

  return patientInfo;
};
