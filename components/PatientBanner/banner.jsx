import React from 'react';
import styles from './banner.css';

/**
 * Purpose: A container for the patient banner if the SMART context specifies a need for a banner
 */
class PatientBanner extends React.PureComponent {

  render() {
    return (
      <div className={this.props.hideBanner ? styles.hidden : styles.container}>
        <div className={styles['patient-container']}>
          <span className={styles.name}>{this.props.name}</span>
          <div className={styles.details}>
            <span className={styles.age}>{this.props.age}</span>
            <span className={styles.gender}>{this.props.gender}</span>
            <span className={styles.dob}>{this.props.dobPrompt}</span>
            <span>{this.props.dob}</span>
          </div>
        </div>
      </div>
    );
  }
}
PatientBanner.propTypes = {
  age: React.PropTypes.string,
  dobPrompt: React.PropTypes.string,
  dob: React.PropTypes.string,
  gender: React.PropTypes.string,
  hideBanner: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string,
};

export default PatientBanner;
