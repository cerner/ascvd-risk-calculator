import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, render, mount } from 'enzyme';
import Header from '../../../components/Header/header';

describe('<Header />', () => {
  const headerText = 'ASCVD Risk Calculator';
  const languagePrompt = 'Language';
  let wrapper;
  let locales;
  let currentLocale = 'en';
  let updateLocale = jest.fn();
  chai.use(chaiEnzyme());

  beforeEach(() => {
    updateLocale = jest.fn();
    locales = [
      {name: 'English', val: 'en'},
      {name: 'Spanish', val: 'es'},
    ];
    wrapper = shallow(<Header header={headerText}
                              languagePrompt={languagePrompt}
                              updateLocale={updateLocale}
                              locales={locales}
                              currentLocale={currentLocale} />);
  });


  it('should have props', () => {
    const wrap = mount(<Header header={headerText}
                               languagePrompt={languagePrompt}
                               updateLocale={updateLocale}
                               locales={locales}
                               currentLocale={currentLocale} />);
    expect(wrap.props().header).toBeDefined();
    expect(wrap.props().locales).toBeDefined();
    expect(wrap.props().updateLocale).toBeDefined();
    expect(wrap.props().currentLocale).toBeDefined();
  });

  it('should have state', () => {
    expect(wrapper.state('isExpanded')).toEqual(false);
    expect(wrapper.state('localeSelected')).toEqual('en');
  });

  it('should have text', () => {
    expect(wrapper.text()).toContain('ASCVD Risk Calculator');
  });

  it('should have a gear icon that expands into a list of languages', () => {
    expect(wrapper.find('.settings')).toHaveLength(1);
    wrapper.find('.settings').simulate('click');
    chai.expect(wrapper.find('.popup-text')).to.have.className('show');
    expect(wrapper.find('label')).toHaveLength(locales.length);
  });

  it('should have a language default selected', () => {
    wrapper.find('.settings').simulate('click');
    chai.expect(wrapper.find('input').first()).to.be.checked();
  });

  it('should call to update locale upon a click of a language and close the modal', () => {
    wrapper.find('.settings').simulate('click');
    wrapper.find('input').at(1).simulate('change', {'target': {'value': locales[1].val}});
    expect(updateLocale).toHaveBeenCalledWith(locales[1].val);
  });

  it('closes the modal if the gear icon is clicked once opened', () => {
    wrapper.find('.settings').simulate('click');
    chai.expect(wrapper.find('.popup-text')).to.have.className('show');
    wrapper.find('.settings').simulate('click');
    chai.expect(wrapper.find('.popup-text')).to.have.className('hidden');
  });
});
