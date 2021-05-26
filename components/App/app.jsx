import React from 'react';
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl';
import ASCVDRisk from '../../app/load_fhir_data';
import PatientBanner from '../../components/PatientBanner/banner';
import Header from '../../components/Header/header';
import Navbar from '../../components/Navbar/navbar';
import Results from '../../views/Results/index';
import RiskFactors from '../../views/RiskFactors/index';
import Recommendations from '../../views/Recommendations/index';

/**
 * Purpose: Handles the central state for the entire application and view navigation
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.updateView = this.updateView.bind(this);
    this.updateRiskScores = this.updateRiskScores.bind(this);
    this.updateChangedProperty = this.updateChangedProperty.bind(this);
    this.setView = this.setView.bind(this);
    this.getBirthDateDisplay = this.getBirthDateDisplay.bind(this);
    this.addOption = this.addOption.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.state = {
      /**
       * hideNav: Toggles to hide the navigation bar
       */
      hideNav: true,
      /**
       * view: Tracks the current user view
       */
      view: 'Results',
      /**
       * tabIndex: Tracks the index of the current user view
       */
      tabIndex: 0,
      /**
       * riskScore: Tracks a potential ten-year risk score
       */
      riskScore: undefined,
      /**
       * lifetimeScore: Tracks a potential lifetime risk score
       */
      lifetimeScore: undefined,
      /**
       * changedProperty: Toggle for detecting a user-entered change
       */
      changedProperty: false,
      /**
       * options: Tracks any potential risk options the user selects
       */
      options: [],
    };
  }

  /**
   * Returns the component representing the appropriate view
   * @returns {XML} - A React component for the specified view
   */
  setView() {
    if (this.state.view === 'Results') {
      return (
        <Results
          updateRiskScores={this.updateRiskScores}
          updateView={this.updateView}
          hideNav={this.state.hideNav}
          updateChangedProperty={this.updateChangedProperty}
          options={this.state.options}
          removeOption={this.removeOption}
          intl={this.props.intl}
          currentLocale={this.props.currentLocale}
        />
      );
    } else if (this.state.view === 'Risk Factors') {
      return (
        <RiskFactors
          addOption={this.addOption}
          tenYearScore={this.state.riskScore}
          tenYearBest={ASCVDRisk.computeLowestTenYear()}
          lifetimeScore={this.state.lifetimeScore}
          lifetimeBest={ASCVDRisk.computeLowestLifetime()}
          options={this.state.options}
          removeOption={this.removeOption}
          intl={this.props.intl}
          currentLocale={this.props.currentLocale}
        />
      );
    }
    return (
      <Recommendations intl={this.props.intl} />
    );
  }
  /**
   * Displays a user-friendly date of birth
   * @returns {string} - Internationalized string representing a possible date of birth
   */
  getBirthDateDisplay() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;
    let birthDateDisplay = '';
    const date = ASCVDRisk.patientInfo.dateOfBirth;
    if (Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())) {
      birthDateDisplay = propIntl.formatMessage(messages.bannerDate, {
        date: (`0${date.getDate()}`).slice(-2),
        month: (`0${date.getMonth() + 1}`).slice(-2),
        year: date.getFullYear(),
      });
    }
    return birthDateDisplay;
  }


  /**
   * Adds a risk factor option to options property
   * @param val - Risk factor to add
   */
  addOption(val) {
    const options = this.state.options;
    options.push(val);
    this.setState({ options });
  }

  /**
   * Removes a risk factor option from options property
   * @param val - Risk factor to remove
   */
  removeOption(val) {
    const options = this.state.options;
    options.splice(options.indexOf(val), 1);
    this.setState({ options });
  }

  /**
   * Toggles the changedProperty property
   * @param val - Value to toggle the changedProperty property
   */
  updateChangedProperty(val) {
    this.setState({ changedProperty: val });
  }

  /**
   * Updates the view and tabIndex properties to specified view
   * @param viewName - View to update view and tabIndex properties with
   */
  updateView(viewName) {
    if (viewName === 'Results') {
      this.setState({ view: 'Results', tabIndex: 0 });
    } else if (viewName === 'Risk Factors') {
      this.setState({ view: 'Risk Factors', tabIndex: 1 });
    } else {
      this.setState({ view: 'Recommendations', tabIndex: 2 });
    }
  }

  /**
   * Updates the riskScore and lifetimeScore properties
   * @param tenYear - New ten-year score to update riskScore with
   * @param lifetime - New lifetime score to update lifetimeScore with
   */
  updateRiskScores(tenYear, lifetime) {
    this.setState({ hideNav: false, riskScore: tenYear, lifetimeScore: lifetime });
  }

  render() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;
    let gender;
    if (ASCVDRisk.patientInfo.gender &&
      ASCVDRisk.patientInfo.gender.toLowerCase() === 'female') {
      gender = propIntl.formatMessage(messages.bannerFemale);
    } else if (ASCVDRisk.patientInfo.gender &&
      ASCVDRisk.patientInfo.gender.toLowerCase() === 'male') {
      gender = propIntl.formatMessage(messages.bannerMale);
    } else {
      gender = propIntl.formatMessage(messages.bannerUnknownGender);
    }
    return (
      <div>
        <PatientBanner
          hideBanner={ASCVDRisk.hideDemoBanner}
          name={`${ASCVDRisk.patientInfo.firstName} ${ASCVDRisk.patientInfo.lastName}`}
          age={propIntl.formatMessage(messages.bannerYears,
            { age: propIntl.formatNumber(ASCVDRisk.patientInfo.age) })}
          gender={gender}
          dobPrompt={propIntl.formatMessage(messages.bannerDOB)}
          dob={this.getBirthDateDisplay()}
        />
        <Header
          header={propIntl.formatMessage(messages.appHeader)}
          languagePrompt={propIntl.formatMessage(messages.language)}
          locales={[
            { name: propIntl.formatMessage(messages.enUS), val: 'en' },
            { name: propIntl.formatMessage(messages.enUK), val: 'en-GB' },
            { name: propIntl.formatMessage(messages.es), val: 'es' },
          ]}
          updateLocale={this.props.updateLocale}
          currentLocale={this.props.currentLocale}
        />
        <Navbar
          updateView={this.updateView}
          tab_one={'Results'}
          tab_two={'Risk Factors'}
          tab_three={'Recommendations'}
          tabIndex={this.state.tabIndex}
          hideNav={this.state.hideNav}
          changedProperty={this.state.changedProperty}
          intl={propIntl}
          currentLocale={this.props.currentLocale}
        />
        { this.setView() }
      </div>
    );
  }
}
App.propTypes = {
  intl: intlShape,
  currentLocale: PropTypes.string,
  updateLocale: PropTypes.func.isRequired,
};

export default App;
