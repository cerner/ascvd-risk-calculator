jest.mock('../../../app/load_fhir_data');

import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallowWithIntl, mountWithIntl } from '../../helpers/intl-enzyme-test-helper';
import Entry from '../../../components/Entry/entry';
import App from '../../../components/App/index';
import ErrorContainer from '../../../components/Error/index';

describe('<Entry />', () => {

  let wrapper;
  chai.use(chaiEnzyme());

  beforeEach(() => {
    wrapper = shallowWithIntl(<Entry displayErrorScreen={false} />);
  });

  it('should have props', () => {
    const wrap = mountWithIntl(<Entry displayErrorScreen={false} />);
    expect(wrap.props('displayErrorScreen')).toBeDefined();
  });

  it('should have state', () => {
    expect(wrapper.state('locale')).toBeDefined();
  });

  describe('when displayErrorScreen prop is set to false', () => {

    it('should contain a IntlProvider and App component', () => {
      expect(wrapper.find(App)).toHaveLength(1);
    });
  });

  describe('when displayErrorScreen prop is set to true', () => {

    it('should contain a IntlProvider and an ErrorContainer component', () => {
      wrapper = shallowWithIntl(<Entry displayErrorScreen />);
      expect(wrapper.find(ErrorContainer)).toHaveLength(1);
    });
  });

  it('should change locale state if another language is specified', () => {
    const wrap = mountWithIntl(<Entry />);
    wrap.find('.settings').simulate('click');
    wrap.find('input[name="locales"]').at(0).simulate('change', {'target': {'value': 'en-us'}})
    expect(wrap.state('locale')).toEqual('en-us');
  });

});
