jest.mock('../../../../app/load_fhir_data');

import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, render, mount } from 'enzyme';
import SimulatedRisk from '../../../../components/Results/SimulatedRisk/simulated_risk';
import RiskAction from '../../../../components/Results/RiskAction/risk_action';

describe('<SimulatedRisk />', () => {
  let scoreBest;
  let scoreCurrent;
  let potentialRisk;
  let addOption;
  let removeOption;
  let width;
  const title = 'Simulated 10 Year Risk';
  chai.use(chaiEnzyme());

  let wrapper;

  beforeEach(() => {
    scoreBest = 20;
    scoreCurrent = 80;
    potentialRisk = 40;
    width = 1000;
    addOption = jest.fn();
    removeOption = jest.fn();
    wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                     scoreCurrent={scoreCurrent}
                                     potentialRisk={potentialRisk}
                                     addOption={addOption}
                                     removeOption={removeOption}
                                     options={[]}
                                     title={title}
                                     width={width} />);
  });

  it('should have props', () => {
    const wrap = mount(<SimulatedRisk scoreBest={scoreBest}
                                      scoreCurrent={scoreCurrent}
                                      potentialRisk={potentialRisk}
                                      addOption={addOption}
                                      removeOption={removeOption}
                                      options={[]}
                                      title={title}
                                      width={width} />);

    expect(wrap.props().scoreBest).toBeDefined();
    expect(wrap.props().scoreCurrent).toBeDefined();
    expect(wrap.props().potentialRisk).toBeDefined();
    expect(wrap.props().addOption).toBeDefined();
    expect(wrap.props().removeOption).toBeDefined();
    expect(wrap.props().title).toBeDefined();
    expect(wrap.props().options).toBeDefined();
  });

  it('has a bar with face up labels, a risk action section, and a title', () => {
    expect(wrapper.find(RiskAction)).toHaveLength(1);
    expect(wrapper.find('.title').text()).toEqual(title);

    expect(wrapper.find('.bar-labels').children().at(0).text()).toEqual('Current Risk80%');
    expect(wrapper.find('.show').at(0).text()).toEqual('Potential Risk40%');
    expect(wrapper.find('.show').at(1).text()).toEqual('Lowest Possible Risk20%');
    expect(wrapper.find('.last-increment').text()).toEqual('0%');

    const potentialPx = Math.round(((472 * potentialRisk) / scoreCurrent) * 10) / 10;
    const lowestPx = Math.round(((472 * scoreBest) / scoreCurrent) * 10) / 10;
    const currentPx = Math.round((Number(472 - potentialPx - lowestPx)) * 10) / 10;

    chai.expect(wrapper.find('.bar-potential-risk')).to.have.style('height', potentialPx + 'px');
    chai.expect(wrapper.find('.bar-current-risk')).to.have.style('height', currentPx + 'px');
    chai.expect(wrapper.find('.bar-lowest-risk')).to.have.style('height', lowestPx + 'px');
  });

  describe('Wide viewport', () => {
    describe('Current risk label', () => {
      it('hides current risk label if the current risk is equal to lowest possible risk', () => {
        scoreBest = 80;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);
        chai.expect(wrapper.find('.bar-labels').childAt(0)).to.have.style('display', 'none');
      });
    });

    describe('Potential risk label', () => {
      it('hides potential risk label if no risk reduction factor was checked', () => {
        potentialRisk = 0;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);

        expect(wrapper.find('.hidden').text()).toEqual('Potential Risk80%');
      });

      it('hides potential risk label if potential risk reaches lowest risk threshold', () => {
        potentialRisk = 60;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);

        expect(wrapper.find('.remove').text()).toEqual('Potential Risk20%');
      });

      it('shifts potential risk up if it gets close to the lowest possible risk', () => {
        scoreCurrent = 80;
        potentialRisk = 58;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);
        chai.expect(wrapper.find('.show').at(0)).to.have.style('padding-bottom', '12px');
      });
    });

    describe('Lowest possible risk label', () => {
      it('shifts lowest risk down if it gets close to the potential risk label', () => {
        potentialRisk = 58;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);
        chai.expect(wrapper.find('.show').at(1)).to.have.style('padding-top', '12px');
      });
    });

    describe('0% label', () => {
      it('hides the 0% label if the lowest possible risk is 0%', () => {
        scoreBest = 0;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);

        chai.expect(wrapper.find('.last-increment')).to.have.className('remove');
      });

      it('hides the 0% label if there are 3 label collisions', () => {
        potentialRisk = 76;
        scoreBest = 2;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);

        chai.expect(wrapper.find('.last-increment')).to.have.style('display', 'none');
      });
    });
  });

  describe('Smaller viewport', () => {
    describe('Potential risk label', () => {
      it('shifts potential risk up if it gets close to the lowest possible risk', () => {
        potentialRisk = 58;
        width = 600;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);
        chai.expect(wrapper.find('.show').at(0)).to.have.style('padding-bottom', '36px');
      });
    });

    describe('Lowest possible risk label', () => {
      it('shifts lowest risk down if it gets close to the potential risk label', () => {
        potentialRisk = 58;
        width = 600;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);
        chai.expect(wrapper.find('.show').at(1)).to.not.have.style('padding-top', '12px');
      });
    });

    describe('0% label', () => {
      it('hides the 0% label if lowest possible risk label is equal to or higher than 48 px', () => {
        scoreBest = 3;
        width = 600;
        wrapper = shallow(<SimulatedRisk scoreBest={scoreBest}
                                         scoreCurrent={scoreCurrent}
                                         potentialRisk={potentialRisk}
                                         addOption={addOption}
                                         removeOption={removeOption}
                                         options={[]}
                                         title={title}
                                         width={width} />);

        chai.expect(wrapper.find('.last-increment')).to.have.className('remove');
      });
    });
  });
});
