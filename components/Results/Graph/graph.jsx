import React from 'react';
import GraphBar from '../GraphBar/graph_bar';
import styles from './graph.css';

/**
 * Purpose: A container that generates the Graph on the Risk Factors view
 */
class Graph extends React.Component {
  /**
   * Sets the background color for the legend bars
   * @param color - Specified color or empty string for a striped pattern
   * @returns {*} - A CSS style that specifies the background color/pattern
   *                for the bars in the legend
   */
  static setColor(color) {
    if (color === '') {
      return ({
        background: 'repeating-linear-gradient(135deg, #FFB166 0, #ffffff 1px, #ffffff 1px, #FFB166 2px, #FFB166 13px)',
      });
    }
    return ({
      backgroundColor: color,
    });
  }

  /**
   * Check for if the bar on this bar graph should be hidden due to an undefined score
   * @param score - A score for a particular bar on the Graph
   * @returns {boolean} - Value to hide the bar or not
   */
  static shouldHide(score) {
    if (score === null) {
      return true;
    }
    return false;
  }

  constructor(props) {
    super(props);
    this.isOnlyOneScore = this.isOnlyOneScore.bind(this);
    this.adjustForOneScore = this.adjustForOneScore.bind(this);
  }

  /**
   * Checks if there is only one score to display on the graph
   * @returns {boolean} - Value to indicate only one score is available
   */
  isOnlyOneScore() {
    if (this.props.tenYearScore === null || this.props.lifetimeScore === null) {
      return true;
    }
    return false;
  }

  /**
   * Adjusts bars on the graph if only one score is available to display.
   * Adjusts padding accordingly at different widths of the screen.
   * @returns {*} - CSS styles that specify centering of a bar on the bar graph
   */
  adjustForOneScore() {
    if (this.props.width <= 700) {
      return ({
        paddingRight: '57.5px',
        paddingLeft: '57.5px',
      });
    } else if (this.props.width <= 860) {
      return ({
        paddingRight: '180px',
        paddingLeft: '180px',
      });
    }
    return ({
      paddingRight: '200px',
      paddingLeft: '200px',
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles['graph-title']}>Chance of heart attack or stroke</div>
          <div className={styles.label}>Percent (%)</div>
          <div className={styles.yaxis}>
            <div className={styles['first-increment']}>100</div>
            <div className={styles['middle-increments']}>80</div>
            <div className={styles['middle-increments']}>60</div>
            <div className={styles['middle-increments']}>40</div>
            <div className={styles['last-increment']}>20</div>
            <div className={styles['zero-increment']}>0</div>
          </div>
          <div className={styles['graph-border']}>
            <div className={styles['bar-container']}>
              <div
                className={Graph.shouldHide(this.props.tenYearScore) ?
                  styles.hidden : styles['ten-year-group']}
                style={this.isOnlyOneScore() ? this.adjustForOneScore() : {}}
              >
                <GraphBar
                  barColor={''}
                  percent={this.props.tenYearScore}
                  width={this.props.width}
                />
                <GraphBar
                  barColor={'#FF9733'}
                  percent={this.props.tenYearBest}
                  width={this.props.width}
                />
                <div className={styles['bar-label']}>10 Year Risk</div>
              </div>
              <div
                className={Graph.shouldHide(this.props.lifetimeScore) ?
                  styles.hidden : styles['lifetime-group']}
                style={this.isOnlyOneScore() ? this.adjustForOneScore() : {}}
              >
                <GraphBar
                  barColor={''}
                  percent={this.props.lifetimeScore}
                  width={this.props.width}
                />
                <GraphBar
                  barColor={'#FF9733'}
                  percent={this.props.lifetimeBest}
                  width={this.props.width}
                />
                <div className={styles['bar-label']}>Lifetime Risk</div>
              </div>
            </div>
          </div>
          <div className={styles['legend-container']}>
            <div className={styles['legend-bar']} style={Graph.setColor('')} />
            <div className={styles['legend-label']}>Current Risk</div>
            <div className={styles['legend-bar']} style={Graph.setColor('#FF9733')} />
            <div className={styles['legend-label']}>Lowest Possible Risk</div>
          </div>
        </div>
      </div>
    );
  }
}
Graph.propTypes = {
  width: React.PropTypes.number,
  tenYearBest: React.PropTypes.number,
  tenYearScore: React.PropTypes.number,
  lifetimeBest: React.PropTypes.number,
  lifetimeScore: React.PropTypes.number,
};

export default Graph;
