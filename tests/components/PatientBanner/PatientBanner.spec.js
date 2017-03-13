import React from 'react';
import { shallow, render, mount } from 'enzyme';
import PatientBanner from '../../../components/PatientBanner/banner';

describe('<PatientBanner />', () => {

  let wrapper;
  const thisDate = new Date();

  beforeEach(() => {
    wrapper = shallow(<PatientBanner name={'Test Patient'} age={50} gender={'male'}
                                     dob={new Date(thisDate.getFullYear() - 50,
                                       thisDate.getMonth(), thisDate.getDate())}
                                     hideBanner={false} />);
  });

  it('should have props', () => {
    const wrap = mount(<PatientBanner name={'Test Patient'} age={50} gender={'male'}
                                      dob={new Date(thisDate.getFullYear() - 50,
                                        thisDate.getMonth(), thisDate.getDate())}
                                      hideBanner={false} />);

    expect(wrap.props().name).toBeDefined();
    expect(wrap.props().age).toBeDefined();
    expect(wrap.props().gender).toBeDefined();
    expect(wrap.props().dob).toBeDefined();
    expect(wrap.props().hideBanner).toBeDefined();
  });

  it('has necessary fields for a patient banner', () => {
    expect(wrapper.find('.name').text()).toEqual('Test Patient');
    expect(wrapper.find('.age').text()).toEqual('50 yrs');
    expect(wrapper.find('.gender').text()).toEqual('M');
    expect(wrapper.find('.details').children().last().text()).toEqual(`${(thisDate.getMonth() + 1)}/` +
      `${thisDate.getDate()}/${(thisDate.getFullYear() - 50)}`);
  });

  it('hides patient banner if hideBanner property is set to true', () => {
    wrapper = shallow(<PatientBanner name={'Test Patient'} age={50} gender={'male'}
                                     dob={new Date(thisDate.getFullYear() - 50,
                                       thisDate.getMonth(), thisDate.getDate())}
                                     hideBanner={true} />);

    expect(wrapper.find('.hidden')).toHaveLength(1);
  });
});
