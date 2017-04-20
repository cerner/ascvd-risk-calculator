import React from 'react';
import ReactDOM from 'react-dom';
import ASCVDRisk from '../sampledata';
import DetailBox from '../../../../components/DetailBox/detail_box';
import PatientBanner from '../../../../components/PatientBanner/banner';
import Header from '../../../../components/Header/header';
import Navbar from '../../../../components/Navbar/navbar';

// Inject methods for mocks
const injectEntry = require('inject!../../../../components/Entry/entry');
const injectAppIndex = require('inject!../../../../components/App/index');
const injectApp = require('inject!../../../../components/App/app');
const injectForm = require('inject!../../../../views/Results/index');
const injectButton = require('inject!../../../../components/Form/ButtonForm/button_form');
const injectRadioButton = require('inject!../../../../components/Form/RadioButtonForm/radio_button_form');
const injectSendForm = require('inject!../../../../components/Form/SendForm/send_form');
const injectRiskFactors = require('inject!../../../../views/RiskFactors/index');
const injectSimulatedRisk = require('inject!../../../../components/Results/SimulatedRisk/simulated_risk');
const inject = require('inject!../../../../views/Recommendations');

ASCVDRisk.patientInfo.relatedFactors['diabetic'] = true;

// Mocked imports for Graph
let SimulatedRisk = injectSimulatedRisk({
  '../../../app/load_fhir_data': ASCVDRisk
}).default;
let RiskFactors = injectRiskFactors({
  '../../app/load_fhir_data': ASCVDRisk,
  '../../components/Results/SimulatedRisk/simulated_risk': SimulatedRisk
}).default;

// Mocked imports for form
let SendForm = injectSendForm({
  '../../../app/load_fhir_data': ASCVDRisk
}).default;
let RadioButtonForm = injectRadioButton({
  '../../../app/load_fhir_data': ASCVDRisk
}).default;
let ButtonForm = injectButton({
  '../../../app/load_fhir_data': ASCVDRisk
}).default;
let Results = injectForm({
  '../../app/load_fhir_data': ASCVDRisk,
  '../../components/Form/ButtonForm/button_form': ButtonForm,
  '../../components/Form/RadioButtonForm/radio_button_form': RadioButtonForm,
  '../../components/Form/SendForm/send_form': SendForm
}).default;
let Recommendations = inject({
  '../../app/load_fhir_data': ASCVDRisk,
  '../../components/DetailBox/detail_box': DetailBox
}).default;
let App = injectApp({
  '../../app/load_fhir_data': ASCVDRisk,
  '../../components/PatientBanner/banner': PatientBanner,
  '../../components/Header/header': Header,
  '../../components/Navbar/navbar': Navbar,
  '../../views/Results/index': Results,
  '../../views/RiskFactors/index': RiskFactors,
  '../../views/Recommendations/index': Recommendations
}).default;
let AppIndex = injectAppIndex({
  './app': App
}).default;
let Entry = injectEntry({
  '../App/index': AppIndex
}).default;

const form = <Entry />;

ReactDOM.render(form, document.getElementById('container'));
