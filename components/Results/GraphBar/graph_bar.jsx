import React from 'react';
import styles from './graph_bar.css';

/**
 * Purpose: A container for a bar to display on the graph for the
 *          current or lowest possible risk of a particular risk score
 */
class GraphBar extends React.Component {
  constructor(props) {
    super(props);
    this.getBarStyle = this.getBarStyle.bind(this);
    this.getPercentStyle = this.getPercentStyle.bind(this);
    this.getContainerHeight = this.getContainerHeight.bind(this);
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
        background: 'repeating-linear-gradient(135deg, #FFB166 0, #ffffff 1px, #ffffff 1px, #FFB166 2px, #FFB166 13px)',
        float: 'left',
        height,
      };
    }
    return {
      backgroundColor: this.props.barColor,
      float: 'left',
      height,
    };
  }

  /**
   * Checks width of the screen to specify how to center the percentage displays
   * on top of the bar graph
   * @returns {*} - CSS styles to align the percentages
   */
  getPercentStyle() {
    if (this.props.width <= 685 && this.props.barColor === '') {
      return ({
        textAlign: 'left',
        marginLeft: '-13px',
      });
    } else if (this.props.width <= 685 && this.props.barColor !== '') {
      return ({
        textAlign: 'right',
        marginLeft: '5px',
      });
    }
    return ({
      textAlign: 'center',
    });
  }

  /**
   * Calculates a height for this bar container that includes the bar
   * and the percentage display on top
   * @returns {{height: string}} - A CSS style that defines the height of this container
   */
  getContainerHeight() {
    return {
      height: `${Math.round(((250 * (0.01 * this.props.percent)) + 16) * 10) / 10}px`,
    };
  }

  render() {
    return (
      <div className={styles.container} style={this.getContainerHeight()}>
        <div className={styles.percent} style={this.getPercentStyle()}>
          {`${this.props.percent}%`}
        </div>
        <div className={styles.bar} style={this.getBarStyle()} />
      </div>
    );
  }
}
GraphBar.propTypes = {
  barColor: React.PropTypes.string.isRequired,
  percent: React.PropTypes.number,
  width: React.PropTypes.number,
};

export default GraphBar;
