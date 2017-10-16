import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallowWithIntl, mountWithIntl } from '../../../helpers/intl-enzyme-test-helper';
import GraphBar from '../../../../components/Results/GraphBar/graph_bar';

describe('<GraphBar />', () => {
  const percent = 50;
  const percentLabel = 'Current Risk';
  const barColor = "blue";
  const width = 1000;

  let wrapper = shallowWithIntl(<GraphBar barColor={barColor} percent={percent} percentLabel={percentLabel} />);
  chai.use(chaiEnzyme());

  it('should have props', () => {
    const wrap = mountWithIntl(<GraphBar barColor={"blue"} percent={50} percentLabel={percentLabel} />);
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
    wrapper = shallowWithIntl(<GraphBar barColor={''} percent={percent} percentLabel={percentLabel} />);
    chai.expect(wrapper.find('.bar')).to.have.className('current-risk');
  });

  it('should display a percentage that was passed in', () => {
    expect(wrapper.find('.percent').text()).toEqual('50%');
    chai.expect(wrapper.find('.bar')).to.have.className('current-risk');
  });

  it('should shift the percent display on a bar if the width display is collapsed', () => {
    wrapper = shallowWithIntl(<GraphBar barColor={''} percent={percent} percentLabel={percentLabel} />);
    chai.expect(wrapper.find('.percent')).to.have.className('percent-left');
  });
});
