import React from 'react';
import cx from 'classnames';
import styles from './header.css';

/**
 * Purpose: Create a container that contains the title/header for the application
 */
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.localeSelected = this.localeSelected.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      /**
       * isExpanded: Tracks whether the box is collapsed or expanded
       */
      isExpanded: false,
      /**
       * localeSelected: Determine the currently selected locale after filtering region code
       */
      localeSelected: this.localeSelected(),
    };
  }

  handleClick() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  localeSelected() {
    if (this.props.currentLocale.toLowerCase() === 'en-gb') {
      return 'en-GB';
    } else if (this.props.currentLocale.toLowerCase() === 'en-us') {
      return 'en';
    } else if (this.props.currentLocale.toLowerCase() === 'es') {
      return 'es';
    }
    return this.props.currentLocale;
  }

  handleChange(event) {
    this.props.updateLocale(event.target.value);
    this.setState({ localeSelected: event.target.value });
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    return (
      <div className={styles.header} lang={this.props.currentLocale.toLowerCase()}>
        <div className={styles.container}>
          <div className={styles['header-text']}>{this.props.header}</div>
          <div className={styles.settings} onClick={this.handleClick} />
          <span
            className={cx(styles['popup-text'], this.state.isExpanded ?
            styles.show : styles.hidden)}
          >
            <div className={styles.prompt}>{this.props.languagePrompt}</div>
            {
              this.props.locales.map((locale, index) => <label
                className={styles.label} key={index}
                htmlFor="locales"
              >
                <input
                  type="radio"
                  name="locales"
                  value={locale.val}
                  key={index}
                  onChange={this.handleChange}
                  checked={this.state.localeSelected === locale.val}
                />
                {locale.name}
                <br />
              </label>)
            }
          </span>
        </div>
      </div>
    );
  }
}
Header.propTypes = {
  header: React.PropTypes.string.isRequired,
  locales: React.PropTypes.arrayOf(
    React.PropTypes.objectOf(React.PropTypes.string)),
  currentLocale: React.PropTypes.string,
  updateLocale: React.PropTypes.func.isRequired,
  languagePrompt: React.PropTypes.string.isRequired,
};

export default Header;
