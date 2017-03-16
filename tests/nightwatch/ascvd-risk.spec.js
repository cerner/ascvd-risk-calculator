/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const screenshot = require('terra-toolkit').screenshot;

module.exports = {
  afterEach: (browser, done) => {
    screenshot(browser, done);
  },

  'Receives demographic information through the FHIR API': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .assert.visible('#formSex .button_form__active')
      .assert.containsText('.banner__name', 'John Doe');
  },

  'Displays text for the Patient Banner on the Form tab if specified': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .assert.containsText('.banner__patient-container', 'John Doe\n50 yrsM');
  },

  'Receives total cholesterol results through FHIR or manual entry': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .assert.attributeEquals('#formTotalCholesterol .input_text_form__text-entry', 'value', '150')
      .clearValue('#formTotalCholesterol .input_text_form__text-entry')
      .setValue('#formTotalCholesterol .input_text_form__text-entry', '140')
      .assert.attributeEquals('#formTotalCholesterol .input_text_form__text-entry', 'value', '140');
  },

  'Receives HDL results through FHIR or manual entry': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .assert.attributeEquals('#formHdl .input_text_form__text-entry', 'value', '30')
      .clearValue('#formHdl .input_text_form__text-entry')
      .setValue('#formHdl .input_text_form__text-entry', '50')
      .assert.attributeEquals('#formHdl .input_text_form__text-entry', 'value', '50');
  },

  'Receives SysBP results through FHIR or manual entry': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .assert.attributeEquals('#formSysBP .input_text_form__text-entry', 'value', '170')
      .clearValue('#formSysBP .input_text_form__text-entry')
      .setValue('#formSysBP .input_text_form__text-entry', '160')
      .assert.attributeEquals('#formSysBP .input_text_form__text-entry', 'value', '160');
  },

  'Allows the user to indicate smoker status': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .click('#formSmoker .button_form__left .button_form__btn')
      .assert.cssClassPresent('#formSmoker .button_form__left .button_form__btn', 'button_form__active');
  },

  'Allows the user to indicate diabetes status': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .click('#formDiabetic .button_form__left .button_form__btn')
      .assert.cssClassPresent('#formDiabetic .button_form__left .button_form__btn', 'button_form__active');
  },

  'Allows the user to indicate hypertensive status': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .click('#formHypertensive .button_form__left .button_form__btn')
      .assert.cssClassPresent('#formHypertensive .button_form__left .button_form__btn', 'button_form__active');
  },

  'Allows the user to indicate Race': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .click('label[for="option_three"] input')
      .assert.attributeContains('label[for="option_three"] input', 'checked', 'true');
  },

  'Displays required fields and input for Results view': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .assert.containsText('#formSex .button_form__prompt', 'Sex')
      .assert.value('#formSex .button_form__active', 'Male')
      .assert.value('#formSex .button_form__default', 'Female')
      .assert.containsText('#formAge .input_text_form__prompt', 'Age')
      .assert.elementPresent('#formAge input')
      .assert.containsText('.radio_button_form__prompt', 'Race')
      .assert.value('label[for="option_one"] input', 'White')
      .assert.value('label[for="option_two"] input', 'African American')
      .assert.value('label[for="option_three"] input', 'Other')
      .assert.containsText('#formTotalCholesterol .input_text_form__prompt', 'Total Cholesterol (mg/dL)')
      .assert.elementPresent('#formTotalCholesterol input')
      .assert.containsText('#formHdl .input_text_form__prompt', 'HDL - Cholesterol (mg/dL)')
      .assert.elementPresent('#formHdl input')
      .assert.containsText('#formSysBP .input_text_form__prompt', 'Systolic Blood Pressure')
      .assert.elementPresent('#formSysBP input')
      .assert.containsText('#formDiabetic .button_form__prompt', 'Diabetes')
      .assert.value('#formDiabetic .button_form__left .button_form__btn', 'No')
      .assert.value('#formDiabetic .button_form__right .button_form__btn', 'Yes')
      .assert.containsText('#formSmoker .button_form__prompt', 'Current Smoking')
      .assert.value('#formSmoker .button_form__left .button_form__btn', 'No')
      .assert.value('#formSmoker .button_form__right .button_form__btn', 'Yes')
      .assert.containsText('#formHypertensive .button_form__prompt', 'Treatment for Hypertension')
      .assert.value('#formHypertensive .button_form__left .button_form__btn', 'No')
      .assert.value('#formHypertensive .button_form__right .button_form__btn', 'Yes')
      .assert.elementPresent('.send_form__btn')
      .assert.value('.send_form__btn', 'See Risk Score');

    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .assert.elementPresent('#formDiabetic .button_form__required')
      .assert.containsText('.send_form__right', 'Diabetes status is required to compute ASCVD risk');
  },

  'Handles workflow of submitting the form accordingly': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .assert.attributeContains('.send_form__btn', 'disabled', 'true')
      .click('#formDiabetic .button_form__right .button_form__btn')
      .assert.cssClassPresent('.send_form__btn', 'send_form__active')
      .assert.value('.send_form__btn', 'See Risk Score')
      .click('.send_form__btn').click('.navbar__one')
      .assert.value('.send_form__btn', 'Update Risk Score');
  },

  'Hides and displays the Navigation Bar appropriately': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .assert.hidden('.navbar__hidden')
      .click('#formDiabetic .button_form__right .button_form__btn').click('.send_form__btn')
      .assert.visible('.navbar__container');
  },

  'Disables and enables Navigation Bar buttons appropriately': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/results.html`)
      .click('#formDiabetic .button_form__right .button_form__btn').click('.send_form__btn')
      .assert.value('.navbar__one', 'Results').assert.cssClassPresent('.navbar__one', 'navbar__default')
      .assert.value('.navbar__two', 'Risk Factors').assert.cssClassPresent('.navbar__two', 'navbar__active')
      .assert.value('.navbar__three', 'Recommendations').assert.cssClassPresent('.navbar__three', 'navbar__default')
      .click('.navbar__one').click('#formDiabetic .button_form__left .button_form__btn')
      .assert.value('.navbar__active', 'Results')
      .assert.cssClassPresent('.navbar__two', 'navbar__disabled')
      .assert.cssClassPresent('.navbar__three', 'navbar__disabled');
  },

  'Displays a graph with necessary content': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/riskfactors.html`)
      .click('.send_form__active')
      .elements('css selector', '.graph_bar__bar', (res) => {
        browser.assert.ok(res.value.length === 4);
      })
      .assert.containsText('.graph__ten-year-group .graph__bar-label', '10 Year Risk')
      .assert.containsText('.graph__lifetime-group .graph__bar-label', 'Lifetime Risk')
      .assert.containsText('.graph__graph-title', 'Chance of heart attack or stroke')
      .assert.containsText('.graph__yaxis', '100\n80\n60\n40\n20\n0')
      .assert.containsText('.graph__label', 'Percent (%)')
      .assert.containsText('.graph__legend-container', 'Current Risk\nLowest Possible Risk');
  },

  'Displays content for interactive risk factors': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/riskfactors.html`)
      .click('label[for="option_two"] input')
      .click('#formSex .button_form__right input')
      .clearValue('#formAge .input_text_form__text-entry')
      .setValue('#formAge .input_text_form__text-entry', '75')
      .click('.send_form__active')
      .assert.containsText('.simulated_risk__bar-labels', 'Current Risk')
      .assert.containsText('.simulated_risk__bar-labels', 'Lowest Possible Risk')
      .assert.containsText('.simulated_risk__bar-labels', '0%')
      .assert.containsText('.risk_action__prompt',
      'Explore how different actions could reduce your risk of heart attack or stroke')
      .assert.containsText('.risk_action__input-area', 'Take a statin')
      .assert.containsText('.risk_action__input-area', 'Control your blood pressure')
      .assert.containsText('.risk_action__input-area', 'Take aspirin every day')
      .assert.containsText('.risk_action__input-area', 'Quit smoking')
      .assert.hidden('.simulated_risk__bar-potential-risk')
      .click('label[for="aspirin"] input')
      .assert.containsText('.simulated_risk__bar-labels', 'Current Risk\n51.7%')
      .assert.containsText('.simulated_risk__bar-labels', 'Potential Risk\n46.5%')
      .assert.containsText('.simulated_risk__bar-labels', 'Lowest Possible Risk\n8.5%')
      .assert.containsText('.simulated_risk__bar-labels', '0%')
      .assert.visible('.simulated_risk__bar-potential-risk')
      .assert.visible('.simulated_risk__bar-current-risk')
      .assert.visible('.simulated_risk__bar-lowest-risk')
      .click('label[for="sysBP"] input')
      .click('label[for="smoker"] input')
      .assert.hidden('.simulated_risk__bar-current-risk');
  },

  'Displays only relevant simulated risk actions': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/riskfactors.html`)
      .clearValue('#formSysBP .input_text_form__text-entry')
      .setValue('#formSysBP .input_text_form__text-entry', '130')
      .click('#formSmoker .button_form__left .button_form__btn')
      .click('.send_form__active')
      .assert.hidden('label[for="sysBP"]')
      .assert.hidden('label[for="smoker"]');
  },

  'Displays 3-column and 1-column results view accordingly': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/riskfactors.html`)
      .click('.send_form__active')
      .click('.navbar__one')
      .resizeWindow(861, 1000)
      .assert.cssProperty('.index__grouped-column', 'display', 'inline-block')
      .assert.cssProperty('.navbar__container', 'text-align', 'start')
      .resizeWindow(860, 1000)
      .assert.cssProperty('.index__grouped-column', 'width', '180px')
      .assert.cssProperty('.index__grouped-column', 'display', 'block')
      .assert.cssProperty('.navbar__container', 'text-align', 'center');
  },

  'Risk Factors view responds in width to accommodate display width': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/riskfactors.html`)
      .click('.send_form__active')
      .resizeWindow(861, 1000)
      .assert.cssProperty('.graph__graph-border', 'width', '600px')
      .assert.cssProperty('.graph_bar__bar', 'width', '100px')
      .assert.cssProperty('.simulated_risk__bar-total', 'width', '100px')
      .resizeWindow(860, 1000)
      .assert.cssProperty('.graph__graph-border', 'width', '520px')
      .assert.cssProperty('.graph_bar__bar', 'width', '80px')
      .assert.cssProperty('.simulated_risk__bar-total', 'width', '80px')
      .resizeWindow(700, 1000)
      .assert.cssProperty('.graph__graph-border', 'width', '155px')
      .assert.cssProperty('.graph_bar__bar', 'width', '20px')
      .assert.cssProperty('.simulated_risk__bar-total', 'width', '40px');
  },

  'Recommendations view with content': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/recommendations.html`)
      .assert.containsText('#recSmoker .detail_box__title', 'Quit smoking')
      .assert.containsText('#recSmoker .detail_box__description', 'Your risk of heart attack or stroke decreases ' +
      'soon after you quit smoking. Blood flow to the heart and brain is vital, and increases ' +
      'almost immediately after your last cigarette. Additionally, the rate of plaque build-up ' +
      'in your blood vessels decreases. Ask your doctor about smoking cessation aids proven ' +
      'to be effective.')
      .assert.containsText('#recStatin .detail_box__title', 'Consider a statin')
      .assert.containsText('#recStatin .detail_box__description', 'Statins lower LDL (bad) cholesterol ' +
      'and raise HDL (good) cholesterol in your blood. Improved cholesterol levels decrease your ' +
      'risk for a heart attack or a stroke. Discuss the benefits and risks of statins with ' +
      'your doctor.')
      .assert.containsText('#recAspirin .detail_box__title', 'Take an aspirin every day')
      .assert.containsText('#recAspirin .detail_box__description', 'Taking an aspirin daily can ' +
      'reduce your risk of heart attacks and strokes, or reduce the severity of such an event. ' +
      'Your doctor can provide guidance on the recommended daily dose that’s right for you.')
      .assert.containsText('#recBP .detail_box__title', 'Control your blood pressure')
      .assert.containsText('#recBP .detail_box__description', 'High blood pressure stresses your ' +
      'body’s blood vessels, weakening them and greatly increasing your risk for heart attack or stroke.' +
      ' Blood pressure medications, weight control, exercise, and managing your sodium intake can ' +
      'all have positive impact on your blood pressure.')
      .assert.containsText('#recExercise .detail_box__title', 'Exercise')
      .assert.containsText('#recExercise .detail_box__description', 'Regular physical activity helps ' +
      'you control your weight, blood pressure, and cholesterol. Be sure to consult your doctor ' +
      'before starting an exercise program.')
      .click('#recSmoker .detail_box__header')
      .assert.hidden('#recSmoker .detail_box__description')
      .assert.visible('#recSmoker .detail_box__title');
  }
};
