import React from 'react';
import cx from 'classnames';
import { intlShape } from 'react-intl';
import ASCVDRisk from '../../../app/load_fhir_data';
import styles from './button_form.css';

/**
 * Purpose: Create a button container that contains a prompt and two button choices
 */
class ButtonForm extends React.Component {
  /**
   * Check to see the "active" status of a button
   * @param val - Value to check if a button is active or not
   * @param prop - Value to check if it is a gender or related factor prompt
   * @returns {*} - A CSS class that makes a button "active" or "default"
   */
  static isActive(val, prop) {
    if (prop === 'gender') {
      if (val && val.toLowerCase() === ASCVDRisk.patientInfo.gender) {
        return styles.active;
      }
      return styles.default;
    }
    const translatedVal = val === 'Yes';
    if (translatedVal === ASCVDRisk.patientInfo.relatedFactors[prop]) {
      return styles.active;
    }
    return styles.default;
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.missingField = this.missingField.bind(this);
  }

  /**
   * Event handling method to compute a score, and note a changed property when a button is clicked.
   * It sets the value on the ASCVDRisk model accordingly.
   * @param event - The clicking event that has occurred
   */
  handleSubmit(event) {
    if (this.props.property === 'gender') {
      ASCVDRisk.patientInfo.gender = event.target.value.toLowerCase();
      this.props.compute();
      this.props.changedProperty(true);
      this.forceUpdate();
    } else if (event.target.value) {
      const translatedVal = event.target.value.toLowerCase() === 'yes';
      ASCVDRisk.patientInfo.relatedFactors[this.props.property] = translatedVal;
      if (this.props.property === 'smoker'
          && this.props.options.indexOf('smoker') > -1
          && !translatedVal) {
        this.props.removeOption('smoker');
      }
      this.props.compute();
      this.props.changedProperty(true);
      this.forceUpdate();
    }
  }

  /**
   * Check to see if this button form is missing data
   * @returns {*} - A CSS class denoting a missing field or an empty string
   */
  missingField() {
    if (this.props.property === 'gender') {
      if (ASCVDRisk.patientInfo.gender === undefined) {
        return styles.required;
      }
    } else if (ASCVDRisk.patientInfo.relatedFactors[this.props.property] === undefined) {
      return styles.required;
    }
    return '';
  }


  render() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;
    return (
      <div className={styles.container}>
        <div className={cx(styles.prompt, this.missingField())}>{this.props.prompt}</div>
        <div className={styles.left}>
          <button
            className={cx(styles.btn,
              ButtonForm.isActive(this.props.option_one, this.props.property))}
            onClick={this.handleSubmit} value={this.props.option_one}
          >
            {propIntl.formatMessage(messages[`form${this.props.option_one}`])}
          </button>
        </div>
        <div className={styles.right}>
          <button
            className={cx(styles.btn,
              ButtonForm.isActive(this.props.option_two, this.props.property))}
            onClick={this.handleSubmit} value={this.props.option_two}
          >
            {propIntl.formatMessage(messages[`form${this.props.option_two}`])}
          </button>
        </div>
      </div>
    );
  }
}
ButtonForm.propTypes = {
  changedProperty: React.PropTypes.func.isRequired,
  compute: React.PropTypes.func.isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.string),
  option_one: React.PropTypes.string.isRequired,
  option_two: React.PropTypes.string.isRequired,
  prompt: React.PropTypes.string.isRequired,
  property: React.PropTypes.string.isRequired,
  removeOption: React.PropTypes.func,
  intl: intlShape,
};

export default ButtonForm;
