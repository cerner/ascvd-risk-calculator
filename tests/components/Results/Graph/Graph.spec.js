import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallowWithIntl, mountWithIntl } from '../../../helpers/intl-enzyme-test-helper';
import Graph from '../../../../components/Results/Graph/graph';
import GraphBar from '../../../../components/Results/GraphBar/graph_bar';

describe('<Graph />', () => {
  const tenYearBest = 10;
  const tenYearScore = 50;
  const lifetimeBest = 5;
  const lifetimeScore = 30;
  const width = 1000;
  let wrapper;
  chai.use(chaiEnzyme());

  beforeEach(() => {
    wrapper = shallowWithIntl(<Graph tenYearBest={tenYearBest} tenYearScore={tenYearScore}
                             lifetimeBest={lifetimeBest} lifetimeScore={lifetimeScore}
                             width={width} />);
  });

  it('should have props', () => {
    const wrap = mountWithIntl(<Graph tenYearBest={tenYearBest} tenYearScore={tenYearScore}
                              lifetimeBest={lifetimeBest} lifetimeScore={lifetimeScore}
                              width={width} />);
    expect(wrap.props().tenYearBest).toBeDefined();
    expect(wrap.props().tenYearScore).toBeDefined();
    expect(wrap.props().lifetimeBest).toBeDefined();
    expect(wrap.props().lifetimeScore).toBeDefined();
    expect(wrap.props().width).toBeDefined();
  });

  it('should have an x-axis and y-axis label for the graph', () => {
    expect(wrapper.find('.label').text()).toEqual('Percent (%)');
    expect(wrapper.find('.graph-title').text()).toEqual('Chance of heart attack or stroke');
  });

  it('should have 6 increment labels on the y axis', () => {
    expect(wrapper.find('.yaxis').children()).toHaveLength(6);
  });

  it('should have a legend showing two patterns of two types of scores', () => {
    expect(wrapper.find('.legend-container')).toHaveLength(1);
    chai.expect(wrapper.find('.legend-bar').first()).to.have.className('current-risk');
    expect(wrapper.find('.legend-label').first().text()).toEqual('Current Risk');
    chai.expect(wrapper.find('.legend-bar').last()).to.have.className('lowest-risk');
    expect(wrapper.find('.legend-label').last().text()).toEqual('Lowest Possible Risk');
  });

  it('should have 4 graph bars and 2 labels if both scores passed in', () => {
    expect(wrapper.find(GraphBar)).toHaveLength(4);
    expect(wrapper.find('.bar-label').first().text()).toEqual('10 Year Risk');
    expect(wrapper.find('.bar-label').last().text()).toEqual('Lifetime Risk');
  });

  it('should have 2 graph bars and 1 label if only 10 year risk is passed in', () => {
    wrapper = shallowWithIntl(<Graph tenYearBest={tenYearBest} tenYearScore={tenYearScore}
                             lifetimeBest={null} lifetimeScore={null}
                             width={width} />);
    chai.expect(wrapper.find('.bar-container').children().last()).to.have.className('hidden');

    // 10 Year scores take up center of the graph
    chai.expect(wrapper.find('.ten-year-group')).to.have.style('padding-right', '200px');
    chai.expect(wrapper.find('.ten-year-group')).to.have.style('padding-left', '200px');
  });

  it('should have 2 graph bars and 1 label if only lifetime risk is passed in', () => {
    wrapper = shallowWithIntl(<Graph tenYearBest={null} tenYearScore={null}
                             lifetimeBest={lifetimeBest} lifetimeScore={lifetimeScore}
                             width={width} />);
    chai.expect(wrapper.find('.bar-container').children().first()).to.have.className('hidden');

    // Lifetime scores take up center of the graph
    chai.expect(wrapper.find('.lifetime-group')).to.have.style('padding-right', '200px');
    chai.expect(wrapper.find('.lifetime-group')).to.have.style('padding-left', '200px');
  });
});
