jest.mock('../../../app/load_fhir_data');

import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { shallowWithIntl, mountWithIntl } from '../../helpers/intl-enzyme-test-helper';
import ASCVDRisk from '../../../app/load_fhir_data';
import InputTextForm from '../../../components/Form/InputTextForm/input_text_form';

describe('<InputTextForm />', () => {

  let wrapper;
  let comp = jest.fn();
  let updateProp = jest.fn();
  let removeOption = jest.fn();

  beforeEach(() => {
    wrapper = shallowWithIntl(<InputTextForm prompt={'Age'} value={48} property={'age'}
                                     compute={comp} changedProperty={updateProp} options={[]}
                                     removeOption={removeOption} />);
  });

  it('should have state', () => {
    expect(wrapper.state('value')).toEqual(48);
    expect(wrapper.state('errorText')).toEqual('');
  });

  it('should have props', () => {
    let wrap = mountWithIntl(<InputTextForm prompt={'Age'} value={48} property={'age'}
                                    compute={comp} changedProperty={updateProp}
                                    options={[]} removeOption={removeOption} />);
    expect(wrap.props().prompt).toBeDefined();
    expect(wrap.props().property).toBeDefined();
    expect(wrap.props().value).toBeDefined();
    expect(wrap.props().compute).toBeDefined();
    expect(wrap.props().changedProperty).toBeDefined();
    expect(wrap.props().options).toBeDefined();
    expect(wrap.props().removeOption).toBeDefined();
  });

  it('should have a prompt and a text input field', () => {
    expect(wrapper.find('.prompt').text()).toContain('Age');
    expect(wrapper.find('input[type="text"]')).toHaveLength(1);
  });

  it('renders a text field with patient value if given', () => {
    expect(wrapper.find('input[type="text"]').html()).toEqual('<input type="text" ' +
      'class="text-entry" name="user_input" value=\"48\" maxlength="3" placeholder=""/>');
  });

  it('renders a text field with placeholder value ranges if value is not populated', () => {
    wrapper = shallowWithIntl(<InputTextForm prompt={'Age'} value={undefined} property={'age'}
                                     compute={comp} changedProperty={updateProp} />);

    expect(wrapper.find('input[type="text"]').html()).toEqual('<input type="text" ' +
      'class="text-entry" name="user_input" value="" maxlength="3" placeholder="20-79"/>');
  });

  it('renders an asterisk if value is not populated', () => {
    wrapper = shallowWithIntl(<InputTextForm prompt={'Total Cholesterol'} value={undefined} property={'totalCholesterol'}
                                     compute={comp} changedProperty={updateProp}
                                     options={[]} removeOption={removeOption} />);

    expect(wrapper.find('.required')).toHaveLength(1);
  });

  it('renders an asterisk and error text if value is invalid', () => {
    wrapper = shallowWithIntl(<InputTextForm prompt={'Total Cholesterol'} value={2} property={'totalCholesterol'}
                                     compute={comp} changedProperty={updateProp}
                                     options={[]} removeOption={removeOption} />);

    expect(wrapper.find('.required')).toHaveLength(1);
    expect(wrapper.state('errorText')).toEqual('formTotalCholesterolError');
  });

  describe('user input', () => {

    it('allows numeric input', () => {
      const ss = {
        "key": '3',
        "preventDefault": jest.fn()
      };
      wrapper.find('input').simulate('keyPress', ss);
      expect(ss['preventDefault']).not.toHaveBeenCalled();
    });

    it('rejects non-numeric input',() => {
      const ss = {
        "key": 'a',
        "preventDefault": jest.fn()
      };
      wrapper = shallowWithIntl(<InputTextForm prompt={'Age'} value={48} property={'age'}
                                       compute={comp} changedProperty={updateProp}
                                       options={[]} removeOption={removeOption} />);
      wrapper.find('input').simulate('keyPress', ss);
      expect(ss['preventDefault']).toHaveBeenCalled();
    });

    it('changes patient info based on user input', () => {
      expect(wrapper.state('value')).toEqual(48);
      wrapper.find('input').simulate('change', {"target": {"value": 34} });
      expect(wrapper.state('value')).toEqual(34);
    });

    it('displays error text if user input is invalid', () => {
      wrapper = shallowWithIntl(<InputTextForm prompt={'Total Cholesterol'} value={150} property={'totalCholesterol'}
                                       compute={comp} changedProperty={updateProp}
                                       options={[]} removeOption={removeOption} />);
      wrapper.find('input').simulate('change', {"target": {"value": 100} });
      expect(wrapper.state('errorText')).toEqual('formTotalCholesterolError');
      expect(wrapper.find('.form-error')).toHaveLength(1);
      expect(wrapper.find('.required')).toHaveLength(1);
    });

    it('changes year of birth in patient model if user manually enters age value', () => {
      wrapper.find('input').simulate('change', {"target": {"value": 22} });
      expect(ASCVDRisk.computeBirthDateFromAge).toHaveBeenCalled();
    });

    it('calls its callback functions', () => {
      expect(comp).toHaveBeenCalled();
      expect(updateProp).toHaveBeenCalled();
    });

    it('calls removeOption callback if control sysBP risk simulation was checked', () => {
      wrapper = shallowWithIntl(<InputTextForm prompt={'Systolic Blood Pressure'} value={130}
                                       property={'systolicBloodPressure'} compute={comp}
                                       changedProperty={updateProp} options={['sysBP']}
                                       removeOption={removeOption} />);

      wrapper.find('input').simulate('change', {"target": {"value": 135} });
      expect(removeOption).toHaveBeenCalled();
    });
  });
});
