import React from 'react';
import ReactDOM from 'react-dom';
import Entry from './components/Entry/entry';
import ASCVDRisk from './app/load_fhir_data';
import './app/polyfill';

ASCVDRisk.fetchPatientData().then(
  () => {
    const loadingNode = document.getElementById('loadingIndicator');
    while (loadingNode.firstChild) {
      loadingNode.removeChild(loadingNode.firstChild);
    }
    loadingNode.parentNode.removeChild(loadingNode);
    ReactDOM.render(<Entry />, document.getElementById('container'));
  },
);
