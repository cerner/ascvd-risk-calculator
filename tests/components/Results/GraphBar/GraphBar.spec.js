import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, render, mount } from 'enzyme';
import GraphBar from '../../../../components/Results/GraphBar/graph_bar';

describe('<GraphBar />', () => {
  const percent = 50;
  const percentLabel = 'Current Risk';
  const barColor = "blue";
  const width = 1000;
  let wrapper = shallow(<GraphBar barColor={barColor} percentLabel={percentLabel} percent={percent} />);
  chai.use(chaiEnzyme());

  it('should have props', () => {
    const wrap = mount(<GraphBar barColor={"blue"} percentLabel={percentLabel} percent={50} />);
    expect(wrap.props().barColor).toBeDefined();
    expect(wrap.props().percentLabel).toBeDefined();
    expect(wrap.props().percent).toBeDefined();
  });

  it('should have a container of calculated height', () => {
    chai.expect(wrapper.find('.container')).to.have
      .style("height", (Math.round((250 * (.01 * percent) + 60) * 10) / 10) + "px");
  });

  it('should display a bar of calculated height and assigned color', () => {
    chai.expect(wrapper.find('.bar')).to.have
      .style("height", (Math.round((250 * (.01 * percent)) * 10) / 10) + "px");
    chai.expect(wrapper.find('.bar')).to.have.className('lowest-possible-risk');
  });

  it('should display a striped bar if no color is passed in', () => {
    wrapper = shallow(<GraphBar barColor={''} percentLabel={percentLabel} percent={percent} />);
    chai.expect(wrapper.find('.bar')).to.have.className('current-risk');
  });

  it('should display a percentage that was passed in', () => {
    expect(wrapper.find('.percent').text()).toEqual('50%');
    chai.expect(wrapper.find('.bar')).to.have.className('current-risk');
  });

  it('should shift the percent display on a bar if the width display is collapsed', () => {
    wrapper = shallow(<GraphBar barColor={''} percentLabel={percentLabel} percent={percent} />);
    chai.expect(wrapper.find('.percent')).to.have.className('percent-left');
  });
});
