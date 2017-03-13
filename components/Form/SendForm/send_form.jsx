import React from 'react';
import cx from 'classnames';
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
    if (this.props.message !== '') {
      return styles.required;
    }
    return '';
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
          <div className={styles.right}>{this.props.message}</div>
        </div>
      </div>
    );
  }
}
SendForm.propTypes = {
  isEnabled: React.PropTypes.bool.isRequired,
  message: React.PropTypes.string,
  prompt: React.PropTypes.string.isRequired,
  updateChangedProperty: React.PropTypes.func.isRequired,
  updateRiskScores: React.PropTypes.func.isRequired,
  updateView: React.PropTypes.func.isRequired,
};

export default SendForm;
