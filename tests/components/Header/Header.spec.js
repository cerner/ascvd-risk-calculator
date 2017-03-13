import React from 'react';
import { shallow, render, mount } from 'enzyme';
import Header from '../../../components/Header/header';

describe('<Header />', () => {
  const headerText = 'ASCVD Risk Calculator';

  it('should have props', () => {
    const wrap = mount(<Header header={headerText} />);
    expect(wrap.props().header).toBeDefined();
  });

  it('should have one div', () => {
    const wrapper = shallow(<Header header={headerText} />);
    expect(wrapper.find('div')).toHaveLength(1);
  });

  it('should have text', () => {
    const wrapper = shallow(<Header header={headerText} />);
    expect(wrapper.text()).toEqual('ASCVD Risk Calculator');
  });
});
