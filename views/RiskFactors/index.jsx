import React from 'react';
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
    if (this.props.tenYearScore === null) {
      return (
        <SimulatedRisk
          scoreBest={this.props.lifetimeBest}
          scoreCurrent={this.props.lifetimeScore}
          potentialRisk={ASCVDRisk.computePotentialRisk(this.props.options, 'lifetime')}
          addOption={this.props.addOption}
          removeOption={this.props.removeOption}
          title={'Simulated Lifetime Risk'}
          options={this.props.options}
          width={this.state.width}
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
        title={'Simulated 10 Year Risk'}
        options={this.props.options}
        width={this.state.width}
      />
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <Graph
          width={this.state.width}
          tenYearBest={this.props.tenYearBest}
          tenYearScore={this.props.tenYearScore}
          lifetimeBest={this.props.lifetimeBest}
          lifetimeScore={this.props.lifetimeScore}
        />
        <div className={styles.divide} />
        {this.displaySimulatedRisk()}
      </div>
    );
  }
}
RiskFactors.propTypes = {
  addOption: React.PropTypes.func.isRequired,
  tenYearBest: React.PropTypes.number,
  tenYearScore: React.PropTypes.number,
  lifetimeBest: React.PropTypes.number,
  lifetimeScore: React.PropTypes.number,
  options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  removeOption: React.PropTypes.func.isRequired,
};

export default RiskFactors;
