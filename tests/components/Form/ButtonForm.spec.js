jest.mock('../../../app/load_fhir_data');

import React from 'react';
import { shallowWithIntl, mountWithIntl } from '../../helpers/intl-enzyme-test-helper';
import ButtonForm from '../../../components/Form/ButtonForm/button_form';

describe('<ButtonForm />', () => {

  let comp = jest.fn();
  let updateProp = jest.fn();
  let removeOption = jest.fn();

  let wrapper = shallowWithIntl(<ButtonForm prompt={'Sex'} option_one={'Male'} option_two={'Female'} property={'gender'}
                                    compute={comp} changedProperty={updateProp} options={[]}
                                    removeOption={removeOption} />);

  it('should have props', () => {
    let wrap = mountWithIntl(<ButtonForm prompt={'Sex'} option_one={'Male'} option_two={'Female'} property={'gender'}
                                 compute={comp} changedProperty={updateProp} options={[]}
                                 removeOption={removeOption} />);
    expect(wrap.props().prompt).toBeDefined();
    expect(wrap.props().options).toBeDefined();
    expect(wrap.props().option_one).toBeDefined();
    expect(wrap.props().option_two).toBeDefined();
    expect(wrap.props().property).toBeDefined();
    expect(wrap.props().compute).toBeDefined();
    expect(wrap.props().changedProperty).toBeDefined();
    expect(wrap.props().removeOption).toBeDefined();
  });

  describe('Gender Button Group', () => {
    it('should have a prompt and two buttons', () => {
      expect(wrapper.find('.prompt').text()).toContain('Sex');
      expect(wrapper.find('button')).toHaveLength(2);
    });

    it('renders two buttons', () => {
      expect(wrapper.find('.left').childAt(0).html()).toEqual('<button class="btn active" value="Male">Male</button>');
      expect(wrapper.find('.right').childAt(0).html()).toEqual('<button class="btn default" value="Female">Female</button>');
    });

    it('can switch between two options', () => {
      wrapper.find('.right').childAt(0).simulate('click', {'target': {'value': 'female'}});
      expect(wrapper.find('.left').childAt(0).html()).toEqual('<button class="btn default" value="Male">Male</button>');
      expect(wrapper.find('.right').childAt(0).html()).toEqual('<button class="btn active" value="Female">Female</button>');
    });

    it('calls its callback functions', () => {
      expect(comp).toHaveBeenCalled();
      expect(updateProp).toHaveBeenCalled();
    });
  });

  describe('RelatedFactors Button Group', () => {
    let wrapper = shallowWithIntl(<ButtonForm prompt={'Diabetes'} option_one={'No'} option_two={'Yes'} property={'diabetic'}
                                      compute={comp} changedProperty={updateProp} options={[]}
                                      removeOption={removeOption} />);

    it('should have a prompt and two buttons', () => {
      expect(wrapper.find('.prompt').text()).toContain('Diabetes');
      expect(wrapper.find('button')).toHaveLength(2);
    });

    it('renders two buttons', () => {
      expect(wrapper.find('.left').childAt(0).html()).toEqual('<button class="btn active" value="No">No</button>');
      expect(wrapper.find('.right').childAt(0).html()).toEqual('<button class="btn default" value="Yes">Yes</button>');
    });

    it('can switch between two options', () => {
      wrapper.find('.right').childAt(0).simulate('click', {'target': {'value': 'Yes'}});
      expect(wrapper.find('.left').childAt(0).html()).toEqual('<button class="btn default" value="No">No</button>');
      expect(wrapper.find('.right').childAt(0).html()).toEqual('<button class="btn active" value="Yes">Yes</button>');
    });

    it('calls its callback functions', () => {
      expect(comp).toHaveBeenCalled();
      expect(updateProp).toHaveBeenCalled();
    });

    it('calls removeOption callback function if quit smoking risk simulation was checked', () => {
      wrapper = shallowWithIntl(<ButtonForm prompt={'Current Smoking'} option_one={'No'} option_two={'Yes'}
                                    property={'smoker'} compute={comp} changedProperty={updateProp}
                                    options={['smoker']} removeOption={removeOption} />);

      wrapper.find('.left').childAt(0).simulate('click', {'target': {'value': 'No'}});
      expect(removeOption).toHaveBeenCalled();
    });
  });
});
