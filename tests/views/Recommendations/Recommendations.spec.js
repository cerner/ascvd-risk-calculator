jest.mock('../../../app/load_fhir_data');

import React from 'react';
import { shallow, render, mount } from 'enzyme';
import ASCVDRisk from '../../../app/load_fhir_data';
import Recommendations from '../../../views/Recommendations/index';
import DetailBox from '../../../components/DetailBox/detail_box';

/**
 * Requirements Covered: [1152726]
 *  1152726 - Each recommendation displays in a collapsible text box.
 *      - Collapsing/expanding the recommendation title will hide/show the associated text
 */
describe('<Recommendations />', () => {
  it('should render at least 4 recommendations', () => {
    let wrapper = shallow(<Recommendations />);
    expect(wrapper.find(DetailBox)).toHaveLength(5);
  });

  it('should not render a recommendation to quit smoking if patient is not currently a smoker', () => {
    ASCVDRisk.patientInfo.relatedFactors.smoker = false;
    let wrapper = shallow(<Recommendations />);
    expect(wrapper.find('.hidden')).toHaveLength(1);
  });

  it('should render a recommendation to quit smoking if patient is currently a smoker', () => {
    ASCVDRisk.patientInfo.relatedFactors.smoker = true;
    let wrapper = shallow(<Recommendations />);
    expect(wrapper.find('.hidden')).toHaveLength(0);
    expect(wrapper.find(DetailBox)).toHaveLength(5);
  });
});
