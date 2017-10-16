import React from 'react';
import cx from 'classnames';
import { intlShape } from 'react-intl';
import ASCVDRisk from '../../../app/load_fhir_data';
import styles from './send_form.css';

/**
 * Purpose: Create a container that contains a button to compute a risk score
 *          if possible and display any necessary error text indicating missing
 *          fields that need to be filled out
 */
class SendForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.missingField = this.missingField.bind(this);
    this.missingFieldMessage = this.missingFieldMessage.bind(this);
  }

  /**
   * Event handling method to compute possible 10 year and lifetime
   * risk scores, and changes changedProperty property to false. It automatically
   * sends the user to the Risk Factors view.
   */
  handleSubmit() {
    const tenYear = ASCVDRisk.computeTenYearScore(ASCVDRisk.patientInfo);
    const lifetime = ASCVDRisk.computeLifetimeRisk(ASCVDRisk.patientInfo);
    this.props.updateRiskScores(tenYear, lifetime);
    this.props.updateChangedProperty(false);
    this.props.updateView('Risk Factors');
  }

  /**
   * Check to see if there are any error messages to display
   * @returns {*} - A CSS class denoting a missing field or an empty string
   */
  missingField() {
    if (this.props.missingFields.length > 0) {
      return styles.required;
    }
    return '';
  }

  missingFieldMessage() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;
    const missingFields = this.props.missingFields;
    let errorMessage = propIntl.formatMessage(messages.formRequireSpecifiedFields);
    if (missingFields.length === 0) {
      return '';
    } else if (missingFields.length === 9) {
      return propIntl.formatMessage(messages.formRequireAllFields);
    }
    for (let i = 0; i < missingFields.length; i += 1) {
      if (i === missingFields.length - 1) {
        errorMessage += propIntl.formatMessage(messages[missingFields[i]]);
      } else {
        errorMessage += `${propIntl.formatMessage(messages[missingFields[i]])}, `;
      }
    }
    return errorMessage;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <input
            className={cx(styles.btn, (this.props.isEnabled ?
            styles.active : styles.disabled))}
            type="button" onClick={this.handleSubmit} value={this.props.prompt}
            disabled={!this.props.isEnabled} name="send"
          />
        </div>
        <div className={styles['right-container']}>
          <div className={cx(styles['left-asterisk'], this.missingField())} />
          <div className={styles.right}>{this.missingFieldMessage()}</div>
        </div>
      </div>
    );
  }
}
SendForm.propTypes = {
  isEnabled: React.PropTypes.bool.isRequired,
  missingFields: React.PropTypes.arrayOf(React.PropTypes.string),
  prompt: React.PropTypes.string.isRequired,
  updateChangedProperty: React.PropTypes.func.isRequired,
  updateRiskScores: React.PropTypes.func.isRequired,
  updateView: React.PropTypes.func.isRequired,
  intl: intlShape,
};

export default SendForm;
