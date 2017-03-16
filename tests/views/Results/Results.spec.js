jest.mock('../../../app/load_fhir_data');

import React from 'react';
import { shallow, render, mount } from 'enzyme';
import ASCVDRisk from '../../../app/load_fhir_data';
import Results from '../../../views/Results/index';
import ButtonForm from '../../../components/Form/ButtonForm/button_form';
import InputTextForm from '../../../components/Form/InputTextForm/input_text_form';
import RadioButtonForm from '../../../components/Form/RadioButtonForm/radio_button_form';
import SendForm from '../../../components/Form/SendForm/send_form';

describe('<Results />', () => {

  let updateRiskScores = jest.fn();
  let updateView = jest.fn();
  let updateChangedProperty = jest.fn();
  let wrapper = shallow(<Results updateRiskScores={updateRiskScores}
                                 updateView={updateView}
                                 updateChangedProperty={updateChangedProperty}
                                 hideNav={true} options={[]} removeOption={jest.fn()} />);

  it('should have props', () => {
    let wrap = mount(<Results updateRiskScores={updateRiskScores}
                              updateView={updateView}
                              updateChangedProperty={updateChangedProperty}
                              hideNav={true}
                              options={[]}
                              removeOption={jest.fn()} />);
    expect(wrap.props().updateRiskScores).toBeDefined();
    expect(wrap.props().updateView).toBeDefined();
    expect(wrap.props().updateChangedProperty).toBeDefined();
    expect(wrap.props().hideNav).toBeDefined();
    expect(wrap.props().options).toBeDefined();
    expect(wrap.props().removeOption).toBeDefined();
  });

  it('should have state for checking if risk can be computed', () => {
    expect(wrapper.state('canCompute')).toEqual(true);
  });

  it('should render all components for the patient entry form', () => {
    expect(wrapper.find(ButtonForm)).toHaveLength(4);
    expect(wrapper.find(InputTextForm)).toHaveLength(4);
    expect(wrapper.find(RadioButtonForm)).toHaveLength(1);
    expect(wrapper.find(SendForm)).toHaveLength(1);
  });

  it('should change state to compute a score if patient model is valid', () => {
    wrapper = mount(<Results updateRiskScores={updateRiskScores}
                             updateView={updateView}
                             updateChangedProperty={updateChangedProperty}
                             hideNav={true}
                             options={[]}
                             removeOption={jest.fn()} />);

    wrapper.find('input[name="user_input"]').at(1).simulate('change', {'target': {'value': 59}});
    expect(ASCVDRisk.canCalculateScore).toHaveBeenCalled();
    expect(wrapper.state('canCompute')).toEqual(true);
  });

  it('should change state to not compute a score if patient model is invalid', () => {
    ASCVDRisk.canCalculateScore = jest.fn(() => false);
    wrapper.find('input[name="user_input"]').at(1).simulate('change', {'target': {'value': 59}});
    expect(ASCVDRisk.canCalculateScore).toHaveBeenCalled();
    expect(wrapper.state('canCompute')).toEqual(false);
  });
});
