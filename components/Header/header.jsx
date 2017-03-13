import React from 'react';
import styles from './header.css';

/**
 * Purpose: Create a container that contains the title/header for the application
 */
class Header extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className={styles.header}>
        {this.props.header}
      </div>
    );
  }
}
Header.propTypes = {
  header: React.PropTypes.string.isRequired,
};

export default Header;
