import React from 'react';
import { shallow, render, mount } from 'enzyme';
import DetailBox from '../../../components/DetailBox/detail_box';

describe('<DetailBox />', () => {
  let body = 'Body';
  let header = 'Header';
  let wrapper = shallow(<DetailBox boxBody={body} boxHeader={header} />);

  it('should have props', () => {
    let wrap = mount(<DetailBox boxBody={body} boxHeader={header} />);
    expect(wrap.props().boxBody).toBeDefined();
    expect(wrap.props().boxHeader).toBeDefined();
  });

  it('should have state', () => {
    expect(wrapper.state('isExpanded')).toEqual(true);
  });

  it('can be collapsed', () => {
    wrapper.find('.header').simulate('click');
    expect(wrapper.state('isExpanded')).toEqual(false);
    expect(wrapper.find('.page-break').childAt(1).html())
      .toEqual(`<div class="collapsed"><div class="description">${body}</div></div>`);
    expect(wrapper.find('.arrow-right').html()).toEqual('<div class="arrow-right"></div>');
  });

  it('can be expanded', () => {
    wrapper.find('.header').simulate('click');
    expect(wrapper.state('isExpanded')).toEqual(true);
    expect(wrapper.find('.page-break').childAt(1).html())
      .toEqual(`<div class="body"><div class="description">${body}</div></div>`);
    expect(wrapper.find('.arrow-down').html()).toEqual('<div class="arrow-down"></div>');
  });
});
