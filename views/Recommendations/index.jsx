import React from 'react';
import { intlShape } from 'react-intl';
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
    const propIntl = this.props.intl;
    const messages = propIntl.messages;
    return (
      <div className={styles.container}>
        <div id={'recStatin'}>
          <DetailBox
            boxHeader={propIntl.formatMessage(messages.recommendationsStatinHeader)}
            boxBody={propIntl.formatMessage(messages.recommendationsStatinBody)}
          />
        </div>
        <div id={'recBP'}>
          <DetailBox
            boxHeader={propIntl.formatMessage(messages.recommendationsSysBPHeader)}
            boxBody={propIntl.formatMessage(messages.recommendationsSysBPBody)}
          />
        </div>
        <div id={'recExercise'}>
          <DetailBox
            boxHeader={propIntl.formatMessage(messages.recommendationsExerciseHeader)}
            boxBody={propIntl.formatMessage(messages.recommendationsExerciseBody)}
          />
        </div>
        <div id={'recEating'}>
          <DetailBox
            boxHeader={propIntl.formatMessage(messages.recommendationsEatingHeader)}
            boxBody={propIntl.formatMessage(messages.recommendationsEatingBody)}
          />
        </div>
        <div id={'recSmoker'} className={Recommendations.shouldHide('smoker')}>
          <DetailBox
            boxHeader={propIntl.formatMessage(messages.recommendationsSmokerHeader)}
            boxBody={propIntl.formatMessage(messages.recommendationsSmokerBody)}
          />
        </div>
        <div id={'recAspirin'}>
          <DetailBox
            boxHeader={propIntl.formatMessage(messages.recommendationsAspirinHeader)}
            boxBody={propIntl.formatMessage(messages.recommendationsAspirinBody)}
          />
        </div>
      </div>
    );
  }
}
Recommendations.propTypes = {
  intl: intlShape,
};

export default Recommendations;
