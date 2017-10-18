import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { intlShape } from 'react-intl';
import ErrorView from 'terra-clinical-error-view';
import { shallowWithIntl, mountWithIntl } from '../../helpers/intl-enzyme-test-helper';
import ErrorContainer from '../../../components/Error/error_container';

describe('<ErrorContainer />', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = shallowWithIntl(<ErrorContainer authError={true} />);
  });

  it('should have props', () => {
    const wrap = mountWithIntl(<ErrorContainer authError={true} />);
    expect(wrap.props('authError')).toBeDefined();
  });

  describe('when authError prop is set to true', () => {

    it('displays an ErrorView component', () => {
      expect(wrapper.find(ErrorView)).toHaveLength(1);
    });
  });

  describe('when authError prop is set to false', () => {

    it('returns null', () => {
      wrapper = shallowWithIntl(<ErrorContainer authError={false} />);
      expect(wrapper.html()).toBe(null);
    });
  });
});
