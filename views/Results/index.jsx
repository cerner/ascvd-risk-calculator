import React from 'react';
import cx from 'classnames';
import { intlShape } from 'react-intl';
import ASCVDRisk from '../../app/load_fhir_data';
import ButtonForm from '../../components/Form/ButtonForm/button_form';
import InputTextForm from '../../components/Form/InputTextForm/input_text_form';
import RadioButtonForm from '../../components/Form/RadioButtonForm/radio_button_form';
import SendForm from '../../components/Form/SendForm/send_form';
import styles from './index.css';

/**
 * Purpose: The view for the Results tab that displays all necessary
 *          form elements for the user to check
 */
class Results extends React.Component {
  constructor(props) {
    super(props);
    /**
     * canCompute: Tracks whether a score can be computed given all the data filled out
     */
    this.state = {
      canCompute: ASCVDRisk.canCalculateScore(),
    };
    this.computeHandler = this.computeHandler.bind(this);
  }

  /**
   * Sets the canCompute property accordingly if a score can be computed given the current data
   */
  computeHandler() {
    if (ASCVDRisk.canCalculateScore()) {
      this.setState({
        canCompute: true,
      });
    } else {
      this.setState({
        canCompute: false,
      });
    }
  }

  render() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles['grouped-column']}>
            <div className={styles.column}>
              <div id="formSex">
                <ButtonForm
                  prompt={propIntl.formatMessage(messages.formSex)}
                  option_one={'Male'}
                  option_two={'Female'}
                  property={'gender'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  intl={propIntl}
                />
              </div>
              <div id="formAge">
                <InputTextForm
                  prompt={propIntl.formatMessage(messages.formAge)}
                  value={Number(ASCVDRisk.patientInfo.age)}
                  property={'age'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  intl={propIntl}
                />
              </div>
              <RadioButtonForm
                prompt={propIntl.formatMessage(messages.formRace)}
                property={'race'}
                option_one={'White'}
                option_two={'African American'}
                option_three={'Other'}
                compute={this.computeHandler}
                changedProperty={this.props.updateChangedProperty}
                intl={propIntl}
              />
            </div>
            <div className={styles.column}>
              <div id="formTotalCholesterol">
                <InputTextForm
                  prompt={propIntl.formatMessage(messages.formTotalCholesterol)}
                  value={Number(ASCVDRisk.patientInfo.totalCholesterol)}
                  property={'totalCholesterol'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  intl={propIntl}
                />
              </div>
              <div id="formHdl">
                <InputTextForm
                  prompt={propIntl.formatMessage(messages.formHdl)}
                  value={Number(ASCVDRisk.patientInfo.hdl)}
                  property={'hdl'} compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  intl={propIntl}
                />
              </div>
              <div id="formSysBP">
                <InputTextForm
                  prompt={propIntl.formatMessage(messages.formSysBP)}
                  value={Number(ASCVDRisk.patientInfo.systolicBloodPressure)}
                  property={'systolicBloodPressure'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  options={this.props.options}
                  removeOption={this.props.removeOption}
                  intl={propIntl}
                />
              </div>
            </div>
            <div className={cx(styles.column, styles['no-right-padding'])}>
              <div id="formDiabetic">
                <ButtonForm
                  prompt={propIntl.formatMessage(messages.formDiabetic)}
                  option_one={'No'}
                  option_two={'Yes'}
                  property={'diabetic'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  intl={propIntl}
                />
              </div>
              <div id="formSmoker">
                <ButtonForm
                  prompt={propIntl.formatMessage(messages.formSmoker)}
                  option_one={'No'}
                  option_two={'Yes'}
                  property={'smoker'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  options={this.props.options}
                  removeOption={this.props.removeOption}
                  intl={propIntl}
                />
              </div>
              <div id="formHypertensive">
                <ButtonForm
                  prompt={propIntl.formatMessage(messages.formHypertensive)}
                  option_one={'No'}
                  option_two={'Yes'}
                  property={'hypertensive'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  intl={propIntl}
                />
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <SendForm
              prompt={this.props.hideNav ? propIntl.formatMessage(messages.formSubmitFirst)
                : propIntl.formatMessage(messages.formSubmitSecond)}
              missingFields={ASCVDRisk.missingFields()}
              isEnabled={this.state.canCompute}
              updateView={this.props.updateView}
              updateRiskScores={this.props.updateRiskScores}
              updateChangedProperty={this.props.updateChangedProperty}
              intl={propIntl}
            />
          </div>
        </div>
      </div>
    );
  }
}
Results.propTypes = {
  hideNav: React.PropTypes.bool.isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  removeOption: React.PropTypes.func.isRequired,
  updateChangedProperty: React.PropTypes.func.isRequired,
  updateRiskScores: React.PropTypes.func.isRequired,
  updateView: React.PropTypes.func.isRequired,
  intl: intlShape,
};

export default Results;
