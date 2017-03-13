import React from 'react';
import cx from 'classnames';
import ASCVDRisk from '../../../app/load_fhir_data';
import styles from './radio_button_form.css';

/**
 * Purpose: Create a radio button container that contains a prompt and three radio button choices
 */
class RadioButtonForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.missingField = this.missingField.bind(this);
    this.state = {
      /**
       * checked: Tracks the selected radio button if one is selected
       */
      checked: ASCVDRisk.patientInfo.relatedFactors[this.props.property],
    };
  }

  /**
   * Event handling method to compute a score, and note a changed property
   * when a radio button is clicked. It sets the value on the ASCVDRisk model
   * accordingly and sets the checked property.
   * @param event - The clicking event that has occurred
   */
  handleChange(event) {
    switch (event.target.value) {
      case 'White' :
        ASCVDRisk.patientInfo.relatedFactors[this.props.property] = 'white';
        this.setState({ checked: 'white' });
        this.props.changedProperty(true);
        this.props.compute();
        return;
      case 'African American' :
        ASCVDRisk.patientInfo.relatedFactors[this.props.property] = 'aa';
        this.setState({ checked: 'aa' });
        this.props.changedProperty(true);
        this.props.compute();
        return;
      case 'Other' :
        ASCVDRisk.patientInfo.relatedFactors[this.props.property] = 'other';
        this.setState({ checked: 'other' });
        this.props.changedProperty(true);
        this.props.compute();
        break;
      default:
    }
  }

  /**
   * Check to see if this radio button form is missing data
   * @returns {*} - A CSS class denoting a missing field or an empty string
   */
  missingField() {
    if (this.state.checked === undefined) {
      return styles.required;
    }
    return '';
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={cx(styles.prompt, this.missingField())}>{this.props.prompt}</div>
        <label className={styles.label} htmlFor="option_one">
          <input
            type="radio"
            className={styles.radio_input}
            name={this.props.property}
            value={this.props.option_one}
            onChange={this.handleChange}
            checked={this.state.checked === 'white'}
          />
          {this.props.option_one}
        </label>
        <label className={cx(styles.label, styles.middle)} htmlFor="option_two">
          <input
            type="radio"
            className={styles.radio_input}
            name={this.props.property}
            value={this.props.option_two}
            onChange={this.handleChange}
            checked={this.state.checked === 'aa'}
          />
          {this.props.option_two}
        </label>
        <label className={styles.label} htmlFor="option_three">
          <input
            type="radio"
            className={styles.radio_input}
            name={this.props.property}
            value={this.props.option_three}
            onChange={this.handleChange}
            checked={this.state.checked === 'other'}
          />
          {this.props.option_three}
        </label>
      </div>
    );
  }
}
RadioButtonForm.propTypes = {
  changedProperty: React.PropTypes.func.isRequired,
  compute: React.PropTypes.func.isRequired,
  option_one: React.PropTypes.string.isRequired,
  option_two: React.PropTypes.string.isRequired,
  option_three: React.PropTypes.string.isRequired,
  prompt: React.PropTypes.string.isRequired,
  property: React.PropTypes.string.isRequired,
};

export default RadioButtonForm;
