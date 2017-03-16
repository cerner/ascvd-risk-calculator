jest.mock('../../../app/load_fhir_data');

import React from 'react';
import { shallow, render, mount } from 'enzyme';
import SendForm from '../../../components/Form/SendForm/send_form';
import ASCVDRisk from '../../../app/load_fhir_data';

describe('<SendForm />', () => {

  let wrapper;
  let updateView = jest.fn();
  let updateRiskScores = jest.fn();
  let updateChangedProp = jest.fn();
  beforeEach(() => {
    wrapper = shallow(<SendForm prompt={'See Risk Score'} isEnabled={false} message={'This'}
                                updateView={updateView} updateRiskScores={updateRiskScores}
                                updateChangedProperty={updateChangedProp} />);
  });

  it('should have props', () => {
    let wrap = mount(<SendForm prompt={'See Risk Score'} isEnabled={false} message={'This'}
                               updateView={updateView} updateRiskScores={updateRiskScores}
                               updateChangedProperty={updateChangedProp} />);
    expect(wrap.props().prompt).toBeDefined();
    expect(wrap.props().isEnabled).toBeDefined();
    expect(wrap.props().message).toBeDefined();
    expect(wrap.props().updateView).toBeDefined();
    expect(wrap.props().updateRiskScores).toBeDefined();
    expect(wrap.props().updateChangedProperty).toBeDefined();
  });

  it('should have a button and a text field', () => {
    expect(wrapper.find('input')).toHaveLength(1);
    expect(wrapper.find('.container').childAt(1).childAt(0)).toHaveLength(1);
  });

  it('should have a button who is active if enabled status is true and allows for computing risk', () => {
    wrapper = shallow(<SendForm prompt={'See Risk Score'} isEnabled={true} message={'This'}
                                updateView={updateView} updateRiskScores={updateRiskScores}
                                updateChangedProperty={updateChangedProp} />);
    expect(wrapper.find('input').hasClass('disabled')).toEqual(false);
    expect(wrapper.find('input').simulate('click'));
    expect(ASCVDRisk.computeTenYearScore).toHaveBeenCalled();
    expect(ASCVDRisk.computeLifetimeRisk).toHaveBeenCalled();
  });

  it('should have a button who is disabled if disabled status is true and does not allow for computing risk', () => {
    wrapper = shallow(<SendForm prompt={'See Risk Score'} isEnabled={false} message={'This'}
                                updateView={updateView} updateRiskScores={updateRiskScores}
                                updateChangedProperty={updateChangedProp} />);
    expect(wrapper.find('input').hasClass('disabled')).toEqual(true);
    expect(wrapper.find('input').simulate('click'));
    expect(wrapper.find('input').html()).toEqual('<input type="button" ' +
      'class="btn disabled" value="See Risk Score" disabled="" name="send"/>');
    expect(wrapper.find('.required')).toHaveLength(1);
  });

  it('calls its callback functions', () => {
    expect(updateView).toHaveBeenCalled();
    expect(updateRiskScores).toHaveBeenCalled();
    expect(updateChangedProp).toHaveBeenCalled();
  });
});
