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
        <div id={'recStatin'}>
          <DetailBox
            boxHeader={'Consider a statin'}
            boxBody={`Statins can reduce your risk of heart attack or stroke by 25%, even if your
              cholesterol level is in the “normal” range. The American Heart Association and American College
              of Cardiology recommend statins for people with diabetes, prior heart disease or stroke, and
              people at high risk of developing heart disease.`}
          />
        </div>
        <div id={'recBP'}>
          <DetailBox
            boxHeader={'Control your blood pressure'}
            boxBody={`Every 10 point lowering of your systolic blood pressure or 5 point lowering of
              your diastolic blood pressure can lower your risk of heart disease by 21%. High blood pressure
              can be treated with diet, weight loss, and medications. Lowering your sodium intake to 2,400 mg
              per day or even as low as 1,000 mg per day can help lower your blood pressure.\n\n Different people
              benefit from different goal blood pressures. Ask your doctor what your goal should be.`}
          />
        </div>
        <div id={'recExercise'}>
          <DetailBox
            boxHeader={'Exercise More'}
            boxBody={`The American Heart Association and American College of Cardiology recommend
              3-4 sessions per week of at least 40 minutes per session of moderate to vigorous
              physical activity. But even small increases in your amount of physical activity
              can improve your heart health.`}
          />
        </div>
        <div id={'recEating'}>
          <DetailBox
            boxHeader={'Eat more Heart-Healthy Food'}
            boxBody={`Try to limit your intake of sugar, including sweets and sugar sweetened drinks.
              Eating more vegetables, fruits, whole grains, low-fat dairy, poultry (chicken), fish, beans,
              olive oil and nuts can help lower your risk of heart disease. Try to avoid or reduce trans
              fat and saturated fat, which are high in lard, butter, red meat, and fried foods.`}
          />
        </div>
        <div id={'recSmoker'} className={Recommendations.shouldHide('smoker')}>
          <DetailBox
            boxHeader={'Quit Smoking'}
            boxBody={`Besides causing cancer and lung disease, smoking is a leading cause of stroke and
              heart attack. Nicotine replacement (patches, gum, lozenges), coaching programs, and
              medications (Chantix, Buproprion) can increase your chances of success. See
              www.smokefree.gov for more information.`}
          />
        </div>
        <div id={'recAspirin'}>
          <DetailBox
            boxHeader={'Aspirin'}
            boxBody={`Aspirin can help lower your risk of heart attack or stroke by about 10%. Aspirin may
              increase your risk of bleeding. Talk to your doctor about whether you may benefit from taking
              aspirin daily and what dose may be the best.`}
          />
        </div>
      </div>
    );
  }
}

export default Recommendations;
