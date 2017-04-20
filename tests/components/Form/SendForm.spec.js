jest.mock('../../../app/load_fhir_data');

import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { shallowWithIntl, mountWithIntl } from '../../helpers/intl-enzyme-test-helper';
import SendForm from '../../../components/Form/SendForm/send_form';
import ASCVDRisk from '../../../app/load_fhir_data';

describe('<SendForm />', () => {

  let wrapper;
  let updateView = jest.fn();
  let updateRiskScores = jest.fn();
  let updateChangedProp = jest.fn();
  let missingFields = ['formSex', 'formSmoker'];
  beforeEach(() => {
    wrapper = shallowWithIntl(<SendForm prompt={'See Risk Score'} isEnabled={false} missingFields={missingFields}
                                updateView={updateView} updateRiskScores={updateRiskScores}
                                updateChangedProperty={updateChangedProp} />);
  });

  it('should have props', () => {
    let wrap = mountWithIntl(<SendForm prompt={'See Risk Score'} isEnabled={false} missingFields={missingFields}
                               updateView={updateView} updateRiskScores={updateRiskScores}
                               updateChangedProperty={updateChangedProp} />);
    expect(wrap.props().prompt).toBeDefined();
    expect(wrap.props().isEnabled).toBeDefined();
    expect(wrap.props().missingFields).toBeDefined();
    expect(wrap.props().updateView).toBeDefined();
    expect(wrap.props().updateRiskScores).toBeDefined();
    expect(wrap.props().updateChangedProperty).toBeDefined();
  });

  it('should have a button and a text field', () => {
    expect(wrapper.find('input')).toHaveLength(1);
    expect(wrapper.find('.container').childAt(1).childAt(0)).toHaveLength(1);
  });

  it('should have a button who is active if enabled status is true and allows for computing risk', () => {
    wrapper = shallowWithIntl(<SendForm prompt={'See Risk Score'} isEnabled={true} missingFields={missingFields}
                                updateView={updateView} updateRiskScores={updateRiskScores}
                                updateChangedProperty={updateChangedProp} />);
    expect(wrapper.find('input').hasClass('disabled')).toEqual(false);
    expect(wrapper.find('input').simulate('click'));
    expect(ASCVDRisk.computeTenYearScore).toHaveBeenCalled();
    expect(ASCVDRisk.computeLifetimeRisk).toHaveBeenCalled();
  });

  it('should have a button who is disabled if enabled status is false and does not allow for computing risk', () => {
    wrapper = shallowWithIntl(<SendForm prompt={'See Risk Score'} isEnabled={false} missingFields={missingFields}
                                updateView={updateView} updateRiskScores={updateRiskScores}
                                updateChangedProperty={updateChangedProp} />);
    expect(wrapper.find('input').hasClass('disabled')).toEqual(true);
    expect(wrapper.find('input').simulate('click'));
    expect(wrapper.find('input').html()).toEqual('<input type="button" ' +
      'class="btn disabled" value="See Risk Score" disabled="" name="send"/>');
    expect(wrapper.find('.required')).toHaveLength(1);
  });

  it('calls its callback functions', () => {
    missingFields = [];
    wrapper = shallowWithIntl(<SendForm prompt={'See Risk Score'} isEnabled={true} missingFields={missingFields}
                                        updateView={updateView} updateRiskScores={updateRiskScores}
                                        updateChangedProperty={updateChangedProp} />);
    expect(updateView).toHaveBeenCalled();
    expect(updateRiskScores).toHaveBeenCalled();
    expect(updateChangedProp).toHaveBeenCalled();
  });
});
