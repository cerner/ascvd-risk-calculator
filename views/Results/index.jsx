import React from 'react';
import cx from 'classnames';
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
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles['grouped-column']}>
            <div className={styles.column}>
              <div id="formSex">
                <ButtonForm
                  prompt={'Sex'} option_one={'Male'} option_two={'Female'}
                  property={'gender'} compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                />
              </div>
              <div id="formAge">
                <InputTextForm
                  prompt={'Age'} value={Number(ASCVDRisk.patientInfo.age)} property={'age'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                />
              </div>
              <RadioButtonForm
                prompt={'Race'} property={'race'} option_one={'White'} option_two={'African American'}
                option_three={'Other'} compute={this.computeHandler}
                changedProperty={this.props.updateChangedProperty}
              />
            </div>
            <div className={styles.column}>
              <div id="formTotalCholesterol">
                <InputTextForm
                  prompt={'Total Cholesterol (mg/dL)'}
                  value={Number(ASCVDRisk.patientInfo.totalCholesterol)}
                  property={'totalCholesterol'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                />
              </div>
              <div id="formHdl">
                <InputTextForm
                  prompt={'HDL - Cholesterol (mg/dL)'} value={Number(ASCVDRisk.patientInfo.hdl)}
                  property={'hdl'} compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                />
              </div>
              <div id="formSysBP">
                <InputTextForm
                  prompt={'Systolic Blood Pressure'}
                  value={Number(ASCVDRisk.patientInfo.systolicBloodPressure)}
                  property={'systolicBloodPressure'} compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  options={this.props.options}
                  removeOption={this.props.removeOption}
                />
              </div>
            </div>
            <div className={cx(styles.column, styles['no-right-padding'])}>
              <div id="formDiabetic">
                <ButtonForm
                  prompt={'Diabetes'} option_one={'No'} option_two={'Yes'} property={'diabetic'}
                  compute={this.computeHandler} changedProperty={this.props.updateChangedProperty}
                />
              </div>
              <div id="formSmoker">
                <ButtonForm
                  prompt={'Current Smoking'} option_one={'No'} option_two={'Yes'} property={'smoker'}
                  compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                  options={this.props.options}
                  removeOption={this.props.removeOption}
                />
              </div>
              <div id="formHypertensive">
                <ButtonForm
                  prompt={'Treatment for Hypertension'} option_one={'No'} option_two={'Yes'}
                  property={'hypertensive'} compute={this.computeHandler}
                  changedProperty={this.props.updateChangedProperty}
                />
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <SendForm
              prompt={this.props.hideNav ? 'See Risk Score' : 'Update Risk Score'}
              message={ASCVDRisk.missingFields()}
              isEnabled={this.state.canCompute}
              updateView={this.props.updateView}
              updateRiskScores={this.props.updateRiskScores}
              updateChangedProperty={this.props.updateChangedProperty}
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
};

export default Results;
