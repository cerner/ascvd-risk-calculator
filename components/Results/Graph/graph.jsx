import React from 'react';
import PropTypes from 'prop-types'
import cx from 'classnames';
import { intlShape } from 'react-intl';
import GraphBar from '../GraphBar/graph_bar';
import styles from './graph.css';

/**
 * Purpose: A container that generates the Graph on the Risk Factors view
 */
class Graph extends React.Component {
  /**
   * Check for if the bar on this bar graph should be hidden due to an undefined score
   * @param score - A score for a particular bar on the Graph
   * @returns {boolean} - Value to hide the bar or not
   */
  static shouldHide(score) {
    return score === null;
  }

  constructor(props) {
    super(props);
    this.isOnlyOneScore = this.isOnlyOneScore.bind(this);
  }

  /**
   * Checks if there is only one score to display on the graph
   * @returns {boolean} - Value to indicate only one score is available
   */
  isOnlyOneScore() {
    return this.props.tenYearScore === null || this.props.lifetimeScore === null;
  }

  render() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;

    let tenYearSpacing = styles['ten-year-group'];
    let lifetimeSpacing = styles['lifetime-group'];
    if (this.isOnlyOneScore()) {
      tenYearSpacing = cx(styles.centerSpacing, styles['ten-year-group']);
      lifetimeSpacing = cx(styles.centerSpacing, styles['lifetime-group']);
    }

    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles['graph-title']}>{propIntl.formatMessage(messages.graphTitle)}</div>
          <div className={styles.label}>{propIntl.formatMessage(messages.graphPercentLabel)}</div>
          <div className={styles.yaxis}>
            <div className={styles['first-increment']}>{propIntl.formatNumber(100)}</div>
            <div className={styles['middle-increments']}>{propIntl.formatNumber(80)}</div>
            <div className={styles['middle-increments']}>{propIntl.formatNumber(60)}</div>
            <div className={styles['middle-increments']}>{propIntl.formatNumber(40)}</div>
            <div className={styles['last-increment']}>{propIntl.formatNumber(20)}</div>
            <div className={styles['zero-increment']}>{propIntl.formatNumber(0)}</div>
          </div>
          <div className={styles['graph-border']}>
            <div className={styles['bar-container']}>
              <div
                className={Graph.shouldHide(this.props.tenYearScore) ?
                  styles.hidden : tenYearSpacing}
              >
                <GraphBar
                  barColor={''}
                  percentLabel={'Current Risk'}
                  percent={this.props.tenYearScore}
                  intl={propIntl}
                />
                <GraphBar
                  barColor={'#FF9733'}
                  percentLabel={'Lowest Possible Risk'}
                  percent={this.props.tenYearBest}
                  intl={propIntl}
                />
                <div className={styles['bar-label']}>{propIntl.formatMessage(messages.graphTenYearRiskLabel)}</div>
              </div>
              <div
                className={Graph.shouldHide(this.props.lifetimeScore) ?
                  styles.hidden : lifetimeSpacing}
              >
                <GraphBar
                  barColor={''}
                  percentLabel={'Current Risk'}
                  percent={this.props.lifetimeScore}
                  intl={propIntl}
                />
                <GraphBar
                  barColor={'#FF9733'}
                  percentLabel={'Lowest Possible Risk'}
                  percent={this.props.lifetimeBest}
                  intl={propIntl}
                />
                <div className={styles['bar-label']}>{propIntl.formatMessage(messages.graphLifetimeRiskLabel)}</div>
              </div>
            </div>
          </div>
          <div className={styles['legend-container']}>
            <div className={cx(styles['legend-bar'], styles['current-risk'])} />
            <div className={styles['legend-label']}>{propIntl.formatMessage(messages.graphCurrentRiskLabel)}</div>
            <div className={cx(styles['legend-bar'], styles['lowest-risk'])} />
            <div className={styles['legend-label']}>{propIntl.formatMessage(messages.graphLowestPossibleRiskLabel)}</div>
          </div>
        </div>
      </div>
    );
  }
}
Graph.propTypes = {
  tenYearBest: PropTypes.number,
  tenYearScore: PropTypes.number,
  lifetimeBest: PropTypes.number,
  lifetimeScore: PropTypes.number,
  intl: intlShape,
};

export default Graph;
