import React from 'react';
import cx from 'classnames';
import styles from './graph_bar.css';

/**
 * Purpose: A container for a bar to display on the graph for the
 *          current or lowest possible risk of a particular risk score
 */
class GraphBar extends React.Component {
  constructor(props) {
    super(props);
    this.getBarStyle = this.getBarStyle.bind(this);
    this.getPercentClass = this.getPercentClass.bind(this);
    this.getContainerHeight = this.getContainerHeight.bind(this);
    this.getBarClass = this.getBarClass.bind(this);
    this.getPercentContainerHeight = this.getPercentContainerHeight.bind(this);
  }

  /**
   * Returns the color/pattern of the bar graph to be displayed based on the
   * barColor prop being passed in
   * @returns {string} - A CSS class containing the background color/pattern
   *                     to be displayed on the bar if possible
   */
  getBarClass() {
    if (this.props.barColor === '') {
      if (this.props.percent === 0) {
        return '';
      }
      return styles['current-risk'];
    }
    if (this.props.percent === 0) {
      return '';
    }
    return styles['lowest-possible-risk'];
  }

  /**
   * Creates the styling of a bar on the graph with a specified
   * color/pattern and calculated height. Height in px is calculated using
   * the passed in score and comparing it to the maximum height of the bar graph.
   * For example: 20% = 50px = (250 * decimal value of 20%)
   * @returns {*} - CSS styles specifying the calculated height of the bar and
   *                background color/pattern of the bar as well as the float property
   */
  getBarStyle() {
    const height = `${Math.round((250 * (0.01 * this.props.percent)) * 10) / 10}px`;
    if (this.props.barColor === '') {
      return {
        float: 'left',
        height,
      };
    }
    return {
      float: 'left',
      height,
    };
  }

  /**
   * Checks if the percentage to display pertains to the current or lowest possible
   * risk and returns the correct css class to display the positioning of the percent
   * display
   * @returns {*} - A CSS class that displays the percentage accordingly on the bar
   */
  getPercentClass() {
    if (this.props.barColor === '') {
      return styles['percent-left'];
    }
    return styles['percent-right'];
  }

  /**
   * Calculates a height for this bar container that includes the bar
   * and the percentage display on top
   * @returns {{height: string}} - A CSS style that defines the height of this container
   */
  getContainerHeight() {
    if (this.props.barColor === '') {
      return {
        height: `${Math.round(((250 * (0.01 * this.props.percent)) + 34) * 10) / 10}px`,
      };
    }
    return {
      height: `${Math.round(((250 * (0.01 * this.props.percent)) + 60) * 10) / 10}px`,
    };
  }

  /**
   * Sets a height for this percent text container that includes the percent
   * and the percent label display on top. Primarily used in the context
   * of a print session.
   * @returns {{height: string}} - A CSS style that defines the height of this container
   */
  getPercentContainerHeight() {
    if (this.props.barColor === '') {
      return {
        height: '34px',
      };
    }
    return {
      height: '60px',
    };
  }

  render() {
    return (
      <div className={styles.container} style={this.getContainerHeight()}>
        <div className={styles['percent-container']} style={this.getPercentContainerHeight()}>
          <div className={styles['percent-label']}>{this.props.percentLabel}</div>
          <div className={cx(styles.percent, this.getPercentClass())}>
            {`${this.props.percent}%`}
          </div>
        </div>
        <div className={cx(styles.bar, this.getBarClass())} style={this.getBarStyle()} />
      </div>
    );
  }
}
GraphBar.propTypes = {
  barColor: React.PropTypes.string.isRequired,
  percentLabel: React.PropTypes.string,
  percent: React.PropTypes.number,
};

export default GraphBar;
