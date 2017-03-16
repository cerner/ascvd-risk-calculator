import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, render, mount } from 'enzyme';
import Navbar from '../../../components/Navbar/navbar';

describe('<Navbar />', () => {

  let wrapper;
  const tab_one = 'one';
  const tab_two = 'two';
  const tab_three = 'three';
  let updateView = jest.fn();
  chai.use(chaiEnzyme());

  beforeEach(() => {
    updateView = jest.fn();
    wrapper = shallow(<Navbar hideNav={false} tabIndex={2} changedProperty={false}
                              updateView={updateView} tab_one={tab_one} tab_two={tab_two}
                              tab_three={tab_three} />);
  });

  it('should have props', () => {
    const wrap = mount(<Navbar hideNav={false} tabIndex={2} changedProperty={false}
                               updateView={updateView} tab_one={tab_one} tab_two={tab_two}
                               tab_three={tab_three} />);
    expect(wrap.props().hideNav).toBeDefined();
    expect(wrap.props().tabIndex).toBeDefined();
    expect(wrap.props().changedProperty).toBeDefined();
    expect(wrap.props().updateView).toBeDefined();
    expect(wrap.props().tab_one).toBeDefined();
    expect(wrap.props().tab_two).toBeDefined();
    expect(wrap.props().tab_three).toBeDefined();
  });

  it('should have 3 tabs if visible', () => {
    expect(wrapper.find('input')).toHaveLength(3);
  });

  it('should hide the navbar if user is on the form tab for the first time', () => {
    wrapper = shallow(<Navbar hideNav={true} tabIndex={0} changedProperty={false}
                              updateView={updateView} tab_one={tab_one} tab_two={tab_two}
                              tab_three={tab_three} />);
    expect(wrapper.find('.hidden')).toHaveLength(1);
  });

  describe('active tabs', () => {
    it('should have all tabs navigable and one tab active', () => {
      expect(wrapper.find('.default')).toHaveLength(2);
      expect(wrapper.find('.active')).toHaveLength(1);
      chai.expect(wrapper.find('.active').first()).to.not.be.disabled();
      chai.expect(wrapper.find('.default').first()).to.not.be.disabled();
      chai.expect(wrapper.find('.default').last()).to.not.be.disabled();
    });

    it('should update the view if a tab is clicked', () => {
      wrapper.find('.default').first().simulate('click', {'event': 'Results'});
      expect(updateView).toHaveBeenCalled();
    });
  });

  describe('disabled tabs', () => {
    const wraps = shallow(<Navbar hideNav={false} tabIndex={0} changedProperty={true}
                                  updateView={updateView} tab_one={tab_one} tab_two={tab_two}
                                  tab_three={tab_three} />);

    it('should have one tab active and the others disabled', () => {
      expect(wraps.find('.active')).toHaveLength(1);
      expect(wraps.find('.disabled')).toHaveLength(2);
      chai.expect(wraps.find('.disabled').first()).to.be.disabled();
      chai.expect(wraps.find('.disabled').last()).to.be.disabled();
    });

    it('should not update the view if a disabled tab is clicked', () => {
      wraps.find('.disabled').first().simulate('click');
      expect(updateView).not.toHaveBeenCalled();
    });
  });
});
