jest.mock('../../../app/load_fhir_data');

import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mountWithIntl, shallowWithIntl } from '../../helpers/intl-enzyme-test-helper';
import ASCVDRisk from '../../../app/load_fhir_data';
import RiskFactors from '../../../views/RiskFactors/index';
import SimulatedRisk from '../../../components/Results/SimulatedRisk/simulated_risk';
import Graph from '../../../components/Results/Graph/graph';

describe('<RiskFactors />', () => {
  let lifetimeBest;
  let lifetimeScore;
  let tenYearBest;
  let tenYearScore;
  let width;
  let wrapper;
  const currentLocale = 'en';
  chai.use(chaiEnzyme());

  beforeEach(() => {
    lifetimeBest = 5;
    lifetimeScore = 20;
    tenYearBest = 10;
    tenYearScore = 40;
    width = 1000;
    wrapper = shallowWithIntl(<RiskFactors addOption={jest.fn()}
                                   lifetimeBest={lifetimeBest}
                                   lifetimeScore={lifetimeScore}
                                   options={[]}
                                   removeOption={jest.fn()}
                                   tenYearBest={tenYearBest}
                                   tenYearScore={tenYearScore}
                                   currentLocale={currentLocale} />);
  });

  it('should have state', () => {
    expect(wrapper.state('width')).toEqual(document.documentElement.clientWidth);
  });

  it('should have props', () => {
    const wrap = mountWithIntl(<RiskFactors addOption={jest.fn()}
                                    lifetimeBest={lifetimeBest}
                                    lifetimeScore={lifetimeScore}
                                    options={[]}
                                    removeOption={jest.fn()}
                                    tenYearBest={tenYearBest}
                                    tenYearScore={tenYearScore}
                                    currentLocale={currentLocale} />);

    expect(wrap.props().addOption).toBeDefined();
    expect(wrap.props().lifetimeBest).toBeDefined();
    expect(wrap.props().lifetimeScore).toBeDefined();
    expect(wrap.props().options).toBeDefined();
    expect(wrap.props().removeOption).toBeDefined();
    expect(wrap.props().tenYearBest).toBeDefined();
    expect(wrap.props().tenYearScore).toBeDefined();
    expect(wrap.props().currentLocale).toBeDefined();
    expect(wrap.props().intl).toBeDefined();
  });

  it('should have a graph section and a simulation of risk', () => {
    expect(wrapper.find(Graph)).toHaveLength(1);
    expect(wrapper.find(SimulatedRisk)).toHaveLength(1);
  });

  it('should display a simulation of risk based on the lifetime risk if 10 year risk is null', () => {
    tenYearScore = null;
    wrapper = shallowWithIntl(<RiskFactors addOption={jest.fn()}
                                   lifetimeBest={lifetimeBest}
                                   lifetimeScore={lifetimeScore}
                                   options={[]}
                                   removeOption={jest.fn()}
                                   tenYearBest={tenYearBest}
                                   tenYearScore={tenYearScore}
                                   currentLocale={currentLocale} />);
    expect(ASCVDRisk.computePotentialRisk).toHaveBeenCalledWith([], 'lifetime');
  });

  it('should display a simulation of risk based on the 10 year risk if both risks are supplied', () => {
    wrapper = shallowWithIntl(<RiskFactors addOption={jest.fn()}
                                   lifetimeBest={lifetimeBest}
                                   lifetimeScore={lifetimeScore}
                                   options={[]}
                                   removeOption={jest.fn()}
                                   tenYearBest={tenYearBest}
                                   tenYearScore={tenYearScore}
                                   currentLocale={currentLocale} />);
    expect(ASCVDRisk.computePotentialRisk).toHaveBeenCalledWith([], 'ten');
  });

  it('should display a simulation of risk based on the 10 year risk if lifetime risk is null', () => {
    lifetimeScore = null;
    wrapper = shallowWithIntl(<RiskFactors addOption={jest.fn()}
                                   lifetimeBest={lifetimeBest}
                                   lifetimeScore={lifetimeScore}
                                   options={[]}
                                   removeOption={jest.fn()}
                                   tenYearBest={tenYearBest}
                                   tenYearScore={tenYearScore}
                                   currentLocale={currentLocale} />);
    expect(ASCVDRisk.computePotentialRisk).toHaveBeenCalledWith([], 'ten');
  });
});
