import React from 'react';
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl';
import ASCVDRisk from '../../app/load_fhir_data';
import Graph from '../../components/Results/Graph/graph';
import SimulatedRisk from '../../components/Results/SimulatedRisk/simulated_risk';
import styles from './index.css';

/**
 * Purpose: A view for the Risk Factors tab that displays the graph to the user
 *          as well as a simulated risk interactivity section
 */
class RiskFactors extends React.Component {
  constructor(props) {
    super(props);
    this.displaySimulatedRisk = this.displaySimulatedRisk.bind(this);
    this.state = {
      /**
       * width: Tracks the width of the HTML canvas
       */
      width: document.documentElement.clientWidth,
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  /**
   * Updates the width property for the user's HTML canvas size
   */
  updateWindowDimensions() {
    this.setState({ width: document.documentElement.clientWidth });
  }

  /**
   * Checks whether to use the ten year risk score or lifetime score for
   * the user in the simulated risk section
   * @returns {XML} - A Simulated Risk React component
   */
  displaySimulatedRisk() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;
    if (this.props.tenYearScore === null) {
      return (
        <SimulatedRisk
          scoreBest={this.props.lifetimeBest}
          scoreCurrent={this.props.lifetimeScore}
          potentialRisk={ASCVDRisk.computePotentialRisk(this.props.options, 'lifetime')}
          addOption={this.props.addOption}
          removeOption={this.props.removeOption}
          title={this.props.intl.formatMessage(messages.riskFactorsSimulatedLifetimeTitle)}
          options={this.props.options}
          width={this.state.width}
          intl={propIntl}
        />
      );
    }
    return (
      <SimulatedRisk
        scoreBest={this.props.tenYearBest}
        scoreCurrent={this.props.tenYearScore}
        potentialRisk={ASCVDRisk.computePotentialRisk(this.props.options, 'ten')}
        addOption={this.props.addOption}
        removeOption={this.props.removeOption}
        title={this.props.intl.formatMessage(messages.riskFactorsSimulatedTenYearTitle)}
        options={this.props.options}
        width={this.state.width}
        intl={propIntl}
      />
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <Graph
          tenYearBest={this.props.tenYearBest}
          tenYearScore={this.props.tenYearScore}
          lifetimeBest={this.props.lifetimeBest}
          lifetimeScore={this.props.lifetimeScore}
          intl={this.props.intl}
        />
        <div className={styles.divide} lang={this.props.currentLocale} />
        <div className={styles['page-break']} />
        {this.displaySimulatedRisk()}
      </div>
    );
  }
}
RiskFactors.propTypes = {
  addOption: PropTypes.func.isRequired,
  tenYearBest: PropTypes.number,
  tenYearScore: PropTypes.number,
  lifetimeBest: PropTypes.number,
  lifetimeScore: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeOption: PropTypes.func.isRequired,
  intl: intlShape,
  currentLocale: PropTypes.string,
};

export default RiskFactors;
