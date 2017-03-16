import React from 'react';
import styles from './banner.css';

/**
 * Purpose: A container for the patient banner if the SMART context specifies a need for a banner
 */
class PatientBanner extends React.Component {
  /**
   * Displays a user-friendly date of birth on the banner
   * @param date - A Date object to display
   * @returns {*} - String of the date of birth or an empty string
   */
  static displayDOB(date) {
    if (Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())) {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return '';
  }

  render() {
    return (
      <div className={this.props.hideBanner ? styles.hidden : styles.container}>
        <div className={styles['patient-container']}>
          <span className={styles.name}>{this.props.name}</span>
          <div className={styles.details}>
            <span className={styles.age}>{`${this.props.age} yrs`}</span>
            <span className={styles.gender}>{this.props.gender === 'male' ? 'M' : 'F'}</span>
            <span className={styles.dob}>{'DOB: '}</span>
            <span>{PatientBanner.displayDOB(this.props.dob)}</span>
          </div>
        </div>
      </div>
    );
  }
}
PatientBanner.propTypes = {
  age: React.PropTypes.number,
  dob: React.PropTypes.instanceOf(Date),
  gender: React.PropTypes.string,
  hideBanner: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string,
};

export default PatientBanner;
