import React from 'react';
import cx from 'classnames';
import styles from './navbar.css';

/**
 * Purpose: Create a container for the navigation bar that may appear on the
 *          top of the application to navigate to different views
 */
class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.renderStyle = this.renderStyle.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
  }

  /**
   * Event handler to update and show a specified view if a property has not been changed
   * @param event - The clicking event that has occurred
   */
  handleClick(event) {
    if (this.props.changedProperty) { return; }
    this.props.updateView(event);
  }

  /**
   * Checks if there are tabs that should be disabled due to the changedProperty
   * property in the App component
   * @returns {boolean} - True if there is a changed property in the Results tab
   */
  isDisabled() {
    if (this.props.changedProperty) {
      return true;
    }
    return false;
  }

  /**
   * Renders a style for a tab to disable a tab, show the "active" state, or enable the tab
   * @param tab - The index of the tab
   * @returns {*} - A CSS class denoting the style and status for the tab
   */
  renderStyle(tab) {
    if (this.props.changedProperty) {
      return styles.disabled;
    }
    if (this.props.tabIndex === tab) {
      return styles.active;
    }
    return styles.default;
  }

  render() {
    return (
      <div className={this.props.hideNav ? styles.hidden : styles.container}>
        <input
          type="button"
          name="nav_tabs"
          className={cx(styles.tab, styles.one,
          this.props.tabIndex === 0 ? styles.active : styles.default)}
          onClick={() => this.handleClick(this.props.tab_one, false)}
          value={this.props.tab_one}
        />
        <input
          type="button"
          name="nav_tabs"
          className={cx(styles.tab, styles.two, this.renderStyle(1))}
          onClick={() => this.handleClick(this.props.tab_two)}
          value={this.props.tab_two}
          disabled={this.isDisabled()}
        />
        <input
          type="button"
          name="nav_tabs"
          className={cx(styles.tab, styles.three, this.renderStyle(2))}
          onClick={() => this.handleClick(this.props.tab_three)}
          value={this.props.tab_three}
          disabled={this.isDisabled()}
        />
      </div>
    );
  }
}
Navbar.propTypes = {
  changedProperty: React.PropTypes.bool.isRequired,
  hideNav: React.PropTypes.bool.isRequired,
  tab_one: React.PropTypes.string.isRequired,
  tab_two: React.PropTypes.string.isRequired,
  tab_three: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired,
  updateView: React.PropTypes.func.isRequired,
};

export default Navbar;
