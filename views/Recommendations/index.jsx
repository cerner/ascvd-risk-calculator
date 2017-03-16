import React from 'react';
import ASCVDRisk from '../../app/load_fhir_data';
import DetailBox from '../../components/DetailBox/detail_box';
import styles from './index.css';

/**
 * Purpose: A view for the Recommendations tab that specifies the recommendation boxes to display
 */
class Recommendations extends React.Component {
  /**
   * Hides a recommendation box if it is not relevant to the patient's background
   * @param risk - The box to potentially hide
   * @returns {*} - A CSS class that hides a specified box or displays it
   */
  static shouldHide(risk) {
    switch (risk) {
      case 'smoker':
        if (!ASCVDRisk.patientInfo.relatedFactors.smoker) {
          return styles.hidden;
        }
        break;
      default:
        return styles.show;
    }
    return styles.show;
  }

  render() {
    return (
      <div className={styles.container}>
        <div id={'recSmoker'} className={Recommendations.shouldHide('smoker')}>
          <DetailBox
            boxHeader={'Quit smoking'}
            boxBody={`Your risk of heart attack or stroke decreases soon after you quit smoking.
              Blood flow to the heart and brain is vital, and increases almost immediately after your last
              cigarette. Additionally, the rate of plaque build-up in your blood vessels decreases. Ask your
              doctor about smoking cessation aids proven to be effective.`}
          />
        </div>
        <div id={'recStatin'}>
          <DetailBox
            boxHeader={'Consider a statin'}
            boxBody={`Statins lower LDL (bad) cholesterol and raise HDL (good) cholesterol in your blood.
              Improved cholesterol levels decrease your risk for a heart attack or a stroke. Discuss the benefits
              and risks of statins with your doctor.`}
          />
        </div>
        <div id={'recAspirin'}>
          <DetailBox
            boxHeader={'Take an aspirin every day'}
            boxBody={`Taking an aspirin daily can reduce your risk of heart attacks and strokes, or reduce
              the severity of such an event. Your doctor can provide guidance on the recommended daily dose that’s
              right for you.`}
          />
        </div>
        <div id={'recBP'}>
          <DetailBox
            boxHeader={'Control your blood pressure'}
            boxBody={`High blood pressure stresses your body’s blood vessels, weakening them and greatly
              increasing your risk for heart attack or stroke. Blood pressure medications, weight control,
              exercise, and managing your sodium intake can all have positive impact on your blood pressure.`}
          />
        </div>
        <div id={'recExercise'}>
          <DetailBox
            boxHeader={'Exercise'}
            boxBody={`Regular physical activity helps you control your weight, blood pressure, and cholesterol.
              Be sure to consult your doctor before starting an exercise program.`}
          />
        </div>
      </div>
    );
  }
}

export default Recommendations;
