import React from 'react';
import ReactDOM from 'react-dom';
import ASCVDRisk from '../sampledata';
import DetailBox from '../../../../components/DetailBox/detail_box';

const inject = require('inject!../../../../views/Recommendations');
let Recommendations = inject({
  '../../app/load_fhir_data': ASCVDRisk,
  '../../components/DetailBox/detail_box': DetailBox
}).default;
const Rec = <Recommendations />;

ReactDOM.render(Rec, document.getElementById('container'));
