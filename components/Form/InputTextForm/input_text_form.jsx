import React from 'react';
import PropTypes from 'prop-types'
import cx from 'classnames';
import { intlShape } from 'react-intl';
import ASCVDRisk from '../../../app/load_fhir_data';
import styles from './input_text_form.css';

/**
 * Purpose: Create an input text container that contains a prompt and text entry input
 */
class InputTextForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * value: Tracks the value of the data passed in or the manually entered text
       */
      value: this.props.value || '',
      /**
       * errorText: Tracks the error message to display for this specific input text field
       */
      errorText: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.putPlaceholder = this.putPlaceholder.bind(this);
    this.missingField = this.missingField.bind(this);
  }

  /**
   * Check on manually entered values to handle the errorText property accordingly and handle
   * the event to compute a score and note a changed property in the application. It sets the value
   * on the ASCVDRisk model accordingly. It also checks to remove a possible risk factor for
   * reducing blood pressure if the manually entered value for the appropriate field is less than
   * or equal to 140 mmHg.
   * @param event - The manually entered value that has occurred
   */
  handleChange(event) {
    if (this.props.property === 'systolicBloodPressure') {
      if (!ASCVDRisk.isValidSysBP(event.target.value)) {
        this.setState({ errorText: 'formSBPError' });
      } else {
        if (this.props.options.indexOf('sysBP') > -1
          && this.props.property === 'systolicBloodPressure'
          && event.target.value <= 140) {
          this.props.removeOption('sysBP');
        }
        this.setState({ errorText: '' });
      }
    } else if (this.props.property === 'totalCholesterol') {
      if (!ASCVDRisk.isValidTotalCholesterol(event.target.value)) {
        this.setState({ errorText: 'formTotalCholesterolError' });
      } else {
        this.setState({ errorText: '' });
      }
    } else if (this.props.property === 'hdl') {
      if (!ASCVDRisk.isValidHDL(event.target.value)) {
        this.setState({ errorText: 'formHDLError' });
      } else {
        this.setState({ errorText: '' });
      }
    } else if (this.props.property === 'age') {
      if (!ASCVDRisk.isValidAge(event.target.value)) {
        this.setState({ errorText: 'formAgeError' });
      } else {
        this.setState({ errorText: '' });
        if (!ASCVDRisk.hideDemoBanner) {
          ASCVDRisk.patientInfo.dateOfBirth = ASCVDRisk.computeBirthDateFromAge(event.target.value);
        }
      }
    }
    ASCVDRisk.patientInfo[this.props.property] = Number(event.target.value) || 0;
    this.setState({ value: event.target.value || '' });
    this.props.compute();
    this.props.changedProperty(true);
  }

  /**
   * Check to validate only numerical text entry
   * @param event - Key press event
   */
  handleKeyPress(event) {
    const re = /^[0-9]$/;
    if (!re.test(Number(event.key))) {
      event.preventDefault();
    }
  }

  /**
   * Places appropriate placeholder text in empty input text forms
   * @param displayedValue - A value property
   * @returns {*} - A string indicating an appropriate numerical range for the input text
   *                form or empty string if the value is valid
   */
  putPlaceholder(displayedValue) {
    if (!this.state.value || displayedValue === '') {
      switch (this.props.property) {
        case 'systolicBloodPressure':
          return '90-200';
        case 'totalCholesterol':
          return '130-320';
        case 'hdl':
          return '20-100';
        case 'age':
          return '20-79';
        default:
      }
    }
    return '';
  }

  /**
   * Check to see if this input form is missing data and sets the errorText property accordingly
   * @returns {*} - A CSS class denoting a missing field or an empty string
   */
  missingField() {
    if (!this.state.value || this.state.errorText !== '') {
      return styles.required;
    }
    if (this.props.property === 'systolicBloodPressure') {
      if (!ASCVDRisk.isValidSysBP(this.state.value)) {
        this.setState({ errorText: 'formSBPError' });
        return styles.required;
      }
    }
    if (this.props.property === 'totalCholesterol') {
      if (!ASCVDRisk.isValidTotalCholesterol(this.state.value)) {
        this.setState({ errorText: 'formTotalCholesterolError' });
        return styles.required;
      }
    }
    if (this.props.property === 'hdl') {
      if (!ASCVDRisk.isValidHDL(this.state.value)) {
        this.setState({ errorText: 'formHDLError' });
        return styles.required;
      }
    }
    if (this.props.property === 'age') {
      if (!ASCVDRisk.isValidAge(this.state.value)) {
        this.setState({ errorText: 'formAgeError' });
        return styles.required;
      }
    }
    return '';
  }

  render() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;
    return (
      <div className={styles.container}>
        <div className={cx(styles.prompt, this.missingField())}>{this.props.prompt}</div>
        <input
          className={styles['text-entry']} type="text" name="user_input"
          value={this.state.value} onKeyPress={this.handleKeyPress}
          maxLength="3" onChange={this.handleChange}
          placeholder={this.putPlaceholder(this.state.value)}
        />
        <small
          className={this.state.errorText === '' ? styles.hidden : styles['form-error']}
        >
          {this.state.errorText !== '' ? propIntl.formatMessage(messages[this.state.errorText]) : ''}
        </small>
      </div>
    );
  }
}
InputTextForm.propTypes = {
  changedProperty: PropTypes.func.isRequired,
  compute: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  prompt: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
  value: PropTypes.number,
  removeOption: PropTypes.func,
  intl: intlShape,
};

export default InputTextForm;
