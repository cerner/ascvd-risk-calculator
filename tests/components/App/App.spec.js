jest.mock('../../../app/load_fhir_data');

import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { intlShape } from 'react-intl';
import { mountWithIntl } from '../../helpers/intl-enzyme-test-helper';
import ASCVDRisk from '../../../app/load_fhir_data';
import App from '../../../components/App/app';
import PatientBanner from '../../../components/PatientBanner/banner';
import Header from '../../../components/Header/header';
import Navbar from '../../../components/Navbar/navbar';
import Results from '../../../views/Results/index';
import RiskFactors from '../../../views/RiskFactors/index';
import Recommendations from '../../../views/Recommendations/index';

describe('<App />', () => {

  let wrapper;
  let updateChangedProperty = jest.fn();
  let updateRiskScores = jest.fn();
  let updateView = jest.fn();
  let updateLocale = jest.fn();
  let currentLocale = 'en';

  beforeEach(() => {
    updateLocale = jest.fn();
    wrapper = mountWithIntl(<App updateLocale={updateLocale}
                                 currentLocale={currentLocale} />);
  });

  it('should have state', () => {
    expect(wrapper.state('hideNav')).toBeTruthy();
    expect(wrapper.state('view')).toEqual('Results');
    expect(wrapper.state('tabIndex')).toEqual(0);
    expect(wrapper.state('riskScore')).toEqual(undefined);
    expect(wrapper.state('lifetimeScore')).toEqual(undefined);
    expect(wrapper.state('changedProperty')).toBeFalsy();
    expect(wrapper.state('options')).toEqual([]);
  });

  it('should have props', () => {
    expect(wrapper.props().currentLocale).toBeDefined();
    expect(wrapper.props().updateLocale).toBeDefined();
  });

  it('should render all components for the main view', () => {
    expect(wrapper.find(PatientBanner)).toHaveLength(1);
    expect(wrapper.find(Header)).toHaveLength(1);
    expect(wrapper.find(Navbar)).toHaveLength(1);
    expect(wrapper.find(Results)).toHaveLength(1);
  });

  it('should render unknown gender accordingly on the patient banner', () => {
    ASCVDRisk.changeGender('indeterminate');
    updateLocale = jest.fn();
    wrapper = mountWithIntl(<App updateLocale={updateLocale}
                                 currentLocale={currentLocale} />);
    expect(wrapper.find('.gender').text()).toEqual('U');
    ASCVDRisk.changeGender('male');
  });

  describe('updating state', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(<App updateLocale={updateLocale}
                                   currentLocale={currentLocale} />);
    });

    it('should execute updateRiskScores callback function and update state', () => {
      wrapper.find('input[name="send"]').simulate('click');
      expect(wrapper.state('hideNav')).toBeFalsy();
      expect(wrapper.state('riskScore'))
        .toEqual(ASCVDRisk.computeTenYearScore(ASCVDRisk.patientInfo));
      expect(wrapper.state('lifetimeScore'))
        .toEqual(ASCVDRisk.computeLifetimeRisk(ASCVDRisk.patientInfo));
    });

    it('should execute updateView callback function and update state (Risk Factors)', () => {
      wrapper.find('input[name="send"]').simulate('click');
      expect(wrapper.state('view')).toEqual('Risk Factors');
      expect(wrapper.state('tabIndex')).toEqual(1);
      expect(wrapper.find(RiskFactors)).toHaveLength(1);
    });

    it('should execute updateView callback function and update state (Recommendations)', () => {
      wrapper.find('input[name="nav_tabs"]').last().simulate('click');
      expect(wrapper.state('view')).toEqual('Recommendations');
      expect(wrapper.state('tabIndex')).toEqual(2);
      expect(wrapper.find(Recommendations)).toHaveLength(1);
    });

    it('should execute updateChangedProperty callback function and update state for false', () => {
      wrapper.find('input[name="send"]').simulate('click');
      expect(wrapper.state('changedProperty')).toBeFalsy();
    });

    it('should execute updateChangedProperty callback function and update state for true', () => {
      wrapper.find('input[name="race"]').at(0).simulate('change', {'target': {'value': 'White'}});
      expect(wrapper.state('changedProperty')).toBeTruthy();
    });

    it('should execute addOption callback function and update state to add clicked option', () => {
      wrapper.find('input[name="send"]').simulate('click');
      wrapper.find('input[name="risk_actions"]').first()
        .simulate('change', {'target': {'checked': true, 'value': 'statin'}});
      expect(wrapper.state('options').indexOf('statin') > -1).toBeTruthy();
    });

    it('should execute removeOption callback function and update state to remove clicked option', () => {
      wrapper.find('input[name="send"]').simulate('click');
      wrapper.find('input[name="risk_actions"]').first()
        .simulate('change', {'target': {'checked': false, 'value': 'statin'}});
      expect(wrapper.state('options').indexOf('statin') > -1).toBeFalsy();
    });
  });
});
