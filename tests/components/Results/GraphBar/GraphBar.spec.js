import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, render, mount } from 'enzyme';
import GraphBar from '../../../../components/Results/GraphBar/graph_bar';

describe('<GraphBar />', () => {
  const percent = 50;
  const barColor = "blue";
  const width = 1000;
  let wrapper = shallow(<GraphBar barColor={barColor} percent={percent} width={width} />);
  chai.use(chaiEnzyme());

  it('should have props', () => {
    const wrap = mount(<GraphBar barColor={"blue"} percent={50} width={width} />);
    expect(wrap.props().barColor).toBeDefined();
    expect(wrap.props().percent).toBeDefined();
    expect(wrap.props().width).toBeDefined();
  });

  it('should have a container of calculated height', () => {
    chai.expect(wrapper.find('.container')).to.have
      .style("height", (Math.round((250 * (.01 * percent) + 16) * 10) / 10) + "px");
  });

  it('should display a bar of calculated height and assigned color', () => {
    chai.expect(wrapper.find('.bar')).to.have
      .style("height", (Math.round((250 * (.01 * percent)) * 10) / 10) + "px");
    chai.expect(wrapper.find('.bar')).to.have.style("background-color", barColor);
  });

  it('should display a striped bar if no color is passed in', () => {
    wrapper = shallow(<GraphBar barColor={''} percent={percent} width={width} />);
    const background =
      "repeating-linear-gradient(135deg, #FFB166 0, #ffffff 1px, #ffffff 1px, #FFB166 2px, #FFB166 13px)";
    chai.expect(wrapper.find('.bar')).to.have.style("background", background);
  });

  it('should display a percentage that was passed in', () => {
    expect(wrapper.find('.percent').text()).toEqual('50%');
    chai.expect(wrapper.find('.percent')).to.have.style("text-align", 'center');
  });

  it('should shift the percent display on a bar if the width display is collapsed', () => {
    wrapper = shallow(<GraphBar barColor={''} percent={percent} width={300} />);
    chai.expect(wrapper.find('.percent')).to.have.style("text-align", 'left');
  });
});
