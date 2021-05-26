import React from 'react';
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl';
import ErrorView from 'terra-clinical-error-view';

/**
 * Purpose: Create a container for an ErrorView component that displays an appropriate message
 */
class ErrorContainer extends React.Component {

  render() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;

    if (this.props.authError) {
      return (
        <ErrorView
          name={propIntl.formatMessage(messages.errorAuthName)}
          description={propIntl.formatMessage(messages.errorAuthMessage)}
          isGlyphHidden={false}
        />
      );
    }
    return (null);
  }
}
ErrorContainer.propTypes = {
  authError: PropTypes.bool,
  intl: intlShape,
};

export default ErrorContainer;
