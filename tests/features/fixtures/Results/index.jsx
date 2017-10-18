import React from 'react';
import ReactDOM from 'react-dom';
import ErrorView from 'terra-clinical-error-view';
import ASCVDRisk from '../sampledata';
import PatientBanner from '../../../../components/PatientBanner/banner';
import Header from '../../../../components/Header/header';
import Navbar from '../../../../components/Navbar/navbar';
import Recommendations from '../../../../views/Recommendations/index';

// Inject methods for mocks
const injectEntry = require('inject-loader!../../../../components/Entry/entry');
const injectAppIndex = require('inject-loader!../../../../components/App/index');
const injectApp = require('inject-loader!../../../../components/App/app');
const injectErrorIndex = require('inject-loader!../../../../components/Error/index');
const injectError = require('inject-loader!../../../../components/Error/error_container');
const injectForm = require('inject-loader!../../../../views/Results/index');
const injectButton = require('inject-loader!../../../../components/Form/ButtonForm/button_form');
const injectRadioButton = require('inject-loader!../../../../components/Form/RadioButtonForm/radio_button_form');
const injectSendForm = require('inject-loader!../../../../components/Form/SendForm/send_form');
const injectRiskFactors = require('inject-loader!../../../../views/RiskFactors/index');
const injectSimulatedRisk = require('inject-loader!../../../../components/Results/SimulatedRisk/simulated_risk');

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
let Error = injectError({
  'terra-clinical-error-view': ErrorView
});
let ErrorIndex = injectErrorIndex({
  './error_container': Error
}).default;
let Entry = injectEntry({
  '../App/index': AppIndex,
  '../Error/index': ErrorIndex
}).default;

const form = <Entry displayErrorScreen={false} />;

ReactDOM.render(form, document.getElementById('container'));
