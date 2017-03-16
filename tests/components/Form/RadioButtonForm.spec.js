jest.mock('../../../app/load_fhir_data');

import React from 'react';
import { shallow, render, mount } from 'enzyme';
import RadioButtonForm from '../../../components/Form/RadioButtonForm/radio_button_form';
import ASCVDRisk from '../../../app/load_fhir_data';

describe('<RadioButtonForm />', () => {
  let wrapper;
  let comp = jest.fn();
  let updateProp = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<RadioButtonForm prompt={'Race'} option_one={'White'} option_two={'African American'}
                                       option_three={'Other'} property={'race'}
                                       compute={comp} changedProperty={updateProp}  />);
  });

  it('should have props', () => {
    let wrap = mount(<RadioButtonForm prompt={'Race'} option_one={'White'} option_two={'African American'}
                                      option_three={'Other'} property={'race'}
                                      compute={comp} changedProperty={updateProp} />);
    expect(wrap.props().prompt).toBeDefined();
    expect(wrap.props().option_one).toBeDefined();
    expect(wrap.props().option_two).toBeDefined();
    expect(wrap.props().option_three).toBeDefined();
    expect(wrap.props().property).toBeDefined();
    expect(wrap.props().compute).toBeDefined();
    expect(wrap.props().changedProperty).toBeDefined();
  });

  it('should have state', () => {
    expect(wrapper.state('checked')).toEqual(ASCVDRisk.patientInfo.relatedFactors['race']);
  });

  it('should have a prompt and three radio button options and labels', () => {
    expect(wrapper.find('.prompt').text()).toContain('Race');
    expect(wrapper.find('label')).toHaveLength(3);
    expect(wrapper.find('input')).toHaveLength(3);
  });

  it('can switch between options', () => {
    expect(ASCVDRisk.patientInfo.relatedFactors['race']).toEqual('white');
    wrapper.find('.middle').childAt(0).simulate('change', {'target': {'value': 'African American'}});
    expect(ASCVDRisk.patientInfo.relatedFactors['race']).toEqual('aa');
    expect(wrapper.state('checked')).toEqual('aa');
    wrapper.find('.container').childAt(1).childAt(0).simulate('change', {'target': {'value': 'White'}});
    expect(ASCVDRisk.patientInfo.relatedFactors['race']).toEqual('white');
    expect(wrapper.state('checked')).toEqual('white');
    wrapper.find('.container').childAt(3).childAt(0).simulate('change', {'target': {'value': 'Other'}});
    expect(ASCVDRisk.patientInfo.relatedFactors['race']).toEqual('other');
    expect(wrapper.state('checked')).toEqual('other');
  });

  it('calls its callback functions', () => {
    expect(comp).toHaveBeenCalled();
    expect(updateProp).toHaveBeenCalled();
  });
});
