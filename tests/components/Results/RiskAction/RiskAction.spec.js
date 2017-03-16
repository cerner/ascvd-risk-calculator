import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, render, mount } from 'enzyme';
import RiskAction from '../../../../components/Results/RiskAction/risk_action';

describe('<RiskAction />', () => {
  const prompt = 'Explore how different actions ' +
    'could reduce your risk of heart attack or stroke.';
  const riskActionLabel1 = 'Take a statin';
  const riskActionLabel2 = 'Control your blood pressure';
  const riskActionLabel3= 'Take aspirin every day';
  const riskActionLabel4 = 'Quit smoking';
  let addOption;
  let removeOption;
  let wrapper;
  chai.use(chaiEnzyme());

  beforeEach(() => {
    addOption = jest.fn();
    removeOption = jest.fn();
    wrapper = shallow(<RiskAction prompt={prompt}
                                  isSmoker={true}
                                  controlSysBP={true}
                                  riskActionLabel1={riskActionLabel1}
                                  riskActionLabel2={riskActionLabel2}
                                  riskActionLabel3={riskActionLabel3}
                                  riskActionLabel4={riskActionLabel4}
                                  addOption={addOption}
                                  removeOption={removeOption}
                                  options={[]} />);
  });

  it('should have props', () => {
    const wrap = mount(<RiskAction prompt={prompt}
                                   isSmoker={true}
                                   controlSysBP={true}
                                   riskActionLabel1={riskActionLabel1}
                                   riskActionLabel2={riskActionLabel2}
                                   riskActionLabel3={riskActionLabel3}
                                   riskActionLabel4={riskActionLabel4}
                                   addOption={addOption}
                                   removeOption={removeOption}
                                   options={[]} />);

    expect(wrap.props().prompt).toBeDefined();
    expect(wrap.props().isSmoker).toBeDefined();
    expect(wrap.props().controlSysBP).toBeDefined();
    expect(wrap.props().riskActionLabel1).toBeDefined();
    expect(wrap.props().riskActionLabel2).toBeDefined();
    expect(wrap.props().riskActionLabel3).toBeDefined();
    expect(wrap.props().riskActionLabel4).toBeDefined();
    expect(wrap.props().addOption).toBeDefined();
    expect(wrap.props().removeOption).toBeDefined();
    expect(wrap.props().options).toBeDefined();
  });

  it('should have 4 inputs if a smoker and has SysBP > 140', () => {
    expect(wrapper.find('.option')).toHaveLength(4);
    expect(wrapper.find('input')).toHaveLength(4);

    expect(wrapper.find('.option').at(0).text()).toEqual(riskActionLabel1);
    expect(wrapper.find('.option').at(1).text()).toEqual(riskActionLabel2);
    expect(wrapper.find('.option').at(2).text()).toEqual(riskActionLabel3);
    expect(wrapper.find('.option').at(3).text()).toEqual(riskActionLabel4);
  });

  it('should have 3 inputs if not a smoker but has SysBP > 140', () => {
    wrapper = shallow(<RiskAction prompt={prompt} isSmoker={false} controlSysBP={true}
                                  riskActionLabel1={'Take a statin'} riskActionLabel2={'Control your blood pressure'}
                                  riskActionLabel3={'Take aspirin every day'} riskActionLabel4={'Quit smoking'}
                                  addOption={addOption} removeOption={removeOption} options={[]} />);

    chai.expect(wrapper.find('input[value="smoker"]').parent()).to.have.className('hidden');
  });

  it('should have 3 inputs if a smoker but SysBP <= 140', () => {
    wrapper = shallow(<RiskAction prompt={prompt} isSmoker={true} controlSysBP={false}
                                  riskActionLabel1={'Take a statin'} riskActionLabel2={'Control your blood pressure'}
                                  riskActionLabel3={'Take aspirin every day'} riskActionLabel4={'Quit smoking'}
                                  addOption={addOption} removeOption={removeOption} options={[]} />);

    chai.expect(wrapper.find('input[value="sysBP"]').parent()).to.have.className('hidden');
  });

  it('should have 2 inputs if not a smoker and SysBP <= 140', () => {
    wrapper = shallow(<RiskAction prompt={prompt} isSmoker={false} controlSysBP={false}
                                  riskActionLabel1={'Take a statin'} riskActionLabel2={'Control your blood pressure'}
                                  riskActionLabel3={'Take aspirin every day'} riskActionLabel4={'Quit smoking'}
                                  addOption={addOption} removeOption={removeOption} options={[]} />);

    chai.expect(wrapper.find('input[value="smoker"]').parent()).to.have.className('hidden');
    chai.expect(wrapper.find('input[value="sysBP"]').parent()).to.have.className('hidden');
  });

  it('should have checked boxes if options passed in contain checked values', () => {
    wrapper = shallow(<RiskAction prompt={prompt} isSmoker={false} controlSysBP={true}
                                  riskActionLabel1={'Take a statin'} riskActionLabel2={'Control your blood pressure'}
                                  riskActionLabel3={'Take aspirin every day'} riskActionLabel4={'Quit smoking'}
                                  addOption={addOption} removeOption={removeOption} options={['statin', 'sysBP']} />);

    expect(wrapper.find('input[checked=true]')).toHaveLength(2);
  });

  it('calls addOption callback function', () => {
    wrapper.find('input[value="statin"]').simulate('change', {'target': {'checked': true, 'value': 'statin'}});
    expect(addOption).toHaveBeenCalledWith('statin');
  });

  it('calls removeOption callback function', () => {
    wrapper.find('input[value="statin"]').simulate('change', {'target': {'checked': false, 'value': 'statin'}});
    expect(removeOption).toHaveBeenCalledWith('statin');
  });
});
