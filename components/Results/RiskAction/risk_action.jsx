import React from 'react';
import styles from './risk_action.css';

/**
 * Purpose: A container for the risk factors section that allows for user
 *          interactivity to choose risk factors that may or may not affect their risk score
 */
class RiskAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * An event handler that uses a callback function to add/remove an
   * option to/from the risk factors options property
   * @param event - The clicking event that has occurred
   */
  handleChange(event) {
    if (event.target.checked) {
      this.props.addOption(event.target.value);
    } else {
      this.props.removeOption(event.target.value);
    }
  }

  render() {
    const riskAction1 = 'statin';
    const riskAction2 = 'sysBP';
    const riskAction3 = 'aspirin';
    const riskAction4 = 'smoker';
    return (
      <div className={styles.container}>
        <div className={styles.prompt}>{this.props.prompt}</div>
        <div className={styles['input-area']}>
          <label className={styles.option} htmlFor={riskAction1}>
            <input
              type="checkbox"
              name={'risk_actions'}
              value={riskAction1}
              onChange={this.handleChange}
              checked={this.props.options.indexOf(riskAction1) > -1}
            />
            {this.props.riskActionLabel1}
          </label>
          <label
            className={this.props.controlSysBP ? styles.option : styles.hidden}
            htmlFor={riskAction2}
          >
            <input
              type="checkbox"
              name={'risk_actions'}
              value={riskAction2}
              onChange={this.handleChange}
              checked={this.props.options.indexOf(riskAction2) > -1 && this.props.controlSysBP}
            />
            {this.props.riskActionLabel2}
          </label>
          <label className={styles.option} htmlFor={riskAction3}>
            <input
              type="checkbox"
              name={'risk_actions'}
              value={riskAction3}
              onChange={this.handleChange}
              checked={this.props.options.indexOf(riskAction3) > -1}
            />
            {this.props.riskActionLabel3}
          </label>
          <label
            className={this.props.isSmoker ? styles.option : styles.hidden}
            htmlFor={riskAction4}
          >
            <input
              type="checkbox"
              name={'risk_actions'}
              value={riskAction4}
              onChange={this.handleChange}
              checked={this.props.options.indexOf(riskAction4) > -1 && this.props.isSmoker}
            />
            {this.props.riskActionLabel4}
          </label>
        </div>
      </div>
    );
  }
}
RiskAction.propTypes = {
  prompt: React.PropTypes.string.isRequired,
  isSmoker: React.PropTypes.bool.isRequired,
  controlSysBP: React.PropTypes.bool.isRequired,
  riskActionLabel1: React.PropTypes.string.isRequired,
  riskActionLabel2: React.PropTypes.string.isRequired,
  riskActionLabel3: React.PropTypes.string.isRequired,
  riskActionLabel4: React.PropTypes.string.isRequired,
  addOption: React.PropTypes.func.isRequired,
  removeOption: React.PropTypes.func.isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
};

export default RiskAction;
