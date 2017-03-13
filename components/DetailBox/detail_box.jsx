import React from 'react';
import styles from './detail_box.css';

/**
 * Purpose: Creates a Recommendation box that contains details of a specific
 *          recommendation and a further description
 */
class DetailBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * isExpanded: Tracks whether the box is collapsed or expanded
       */
      isExpanded: true,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Toggles the isExpanded property of the detail box and displays/hides
   * the description on the detail box
   */
  handleClick() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header} onClick={this.handleClick}>
          <div className={this.state.isExpanded ? styles['arrow-down'] : styles['arrow-right']} />
          <div className={styles.title}>
            {this.props.boxHeader}
          </div>
        </div>
        <div className={this.state.isExpanded ? styles.body : styles.collapsed}>
          <div className={styles.description}>
            {this.props.boxBody}
          </div>
        </div>
      </div>
    );
  }
}
DetailBox.propTypes = {
  boxBody: React.PropTypes.string.isRequired,
  boxHeader: React.PropTypes.string.isRequired,
};

export default DetailBox;
