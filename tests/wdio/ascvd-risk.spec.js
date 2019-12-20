Terra.viewports('small', 'large').forEach((viewport) => {
  var localAddress = require('ip').address()

  describe('When a failed Authorization occurs', () => {
    it('Displays an ErrorView component', () => {
      browser.url(`http://${localAddress}:8080/errorview.html`);
      browser.waitForExist('.ErrorView__error-view', 3000);
      expect(browser.isExisting('.ErrorView__error-view')).to.be.true;
    });
  });

  describe('When viewing the Results screen', () => {
    it('Receives demographic information through the FHIR API', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('#formSex .button_form__active', 3000);
      expect(browser.isExisting('#formSex .button_form__active')).to.be.true;
      expect(browser.getText('#formSex .button_form__active')).to.equal('Male');
      expect(browser.getText('.banner__name')).to.equal('John Doe');
    });

    it('Displays text for the Patient Banner on the Form tab if specified', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('.banner__patient-container', 3000);
      expect(browser.getText('.banner__patient-container')).to.contain('John Doe');
    });

    it('Receives total cholesterol results through FHIR or manual entry', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('#formTotalCholesterol .input_text_form__text-entry', 3000);
      expect(browser.getValue('#formTotalCholesterol .input_text_form__text-entry')).to.equal('150');
      browser.setValue('#formTotalCholesterol .input_text_form__text-entry', '140');
      expect(browser.getValue('#formTotalCholesterol .input_text_form__text-entry')).to.equal('140');
    });

    it('Receives HDL results through FHIR or manual entry', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('#formHdl .input_text_form__text-entry', 3000);
      expect(browser.getValue('#formHdl .input_text_form__text-entry')).to.equal('30');
      browser.setValue('#formHdl .input_text_form__text-entry', '50');
      expect(browser.getValue('#formHdl .input_text_form__text-entry')).to.equal('50');
    });

    it('Receives SysBP results through FHIR or manual entry', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('#formSysBP .input_text_form__text-entry', 3000);
      expect(browser.getValue('#formSysBP .input_text_form__text-entry')).to.equal('170');
      browser.setValue('#formSysBP .input_text_form__text-entry', '160');
      expect(browser.getValue('#formSysBP .input_text_form__text-entry')).to.equal('160');
    });

    it('Allows the user to indicate smoker status', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('#formSmoker .button_form__left .button_form__btn', 3000);
      browser.click('#formSmoker .button_form__left .button_form__btn');
      expect(browser.isExisting('#formSmoker .button_form__left .button_form__btn', 'button_form__active'));
    });

    it('Allows the user to indicate diabetes status', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('#formDiabetic .button_form__left .button_form__btn', 3000);
      browser.click('#formDiabetic .button_form__left .button_form__btn');
      expect(browser.isExisting('#formDiabetic .button_form__left .button_form__btn', 'button_form__active')).to.be.true;
    });

    it('Allows the user to indicate hypertensive status', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('#formHypertensive .button_form__left .button_form__btn', 3000);
      browser.click('#formHypertensive .button_form__left .button_form__btn');
      expect(browser.isExisting('#formHypertensive .button_form__left .button_form__btn', 'button_form__active')).to.be.true;
    });

    it('Allows the user to indicate Race', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('label[for="option_three"] input', 3000);
      browser.click('label[for="option_three"] input');
      expect(browser.isSelected('label[for="option_one"] input')).to.be.false;
      expect(browser.isSelected('label[for="option_two"] input')).to.be.false;
      expect(browser.isSelected('label[for="option_three"] input')).to.be.true;
    });

    it('Displays required fields and input for Results view', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('#formSex .button_form__prompt', 3000);
      expect(browser.getText('#formSex .button_form__prompt')).to.equal('Sex');
      expect(browser.getText('#formSex .button_form__active')).to.equal('Male');
      expect(browser.getText('#formSex .button_form__default')).to.equal('Female');
      expect(browser.getText('#formAge .input_text_form__prompt')).to.equal('Age');
      expect(browser.isExisting('#formAge input')).to.be.true;
      expect(browser.getText('.radio_button_form__prompt')).to.equal('Race');
      expect(browser.getText('label[for="option_one"]')).to.equal('White');
      expect(browser.getText('label[for="option_two"]')).to.equal('African American');
      expect(browser.getText('label[for="option_three"]')).to.equal('Other');
      expect(browser.getText('#formTotalCholesterol .input_text_form__prompt')).to.equal('Total Cholesterol (mg/dL)');
      expect(browser.isExisting('#formTotalCholesterol input'));
      expect(browser.getText('#formHdl .input_text_form__prompt')).to.equal('HDL - Cholesterol (mg/dL)');
      expect(browser.isExisting('#formHdl input')).to.be.true;
      expect(browser.getText('#formSysBP .input_text_form__prompt')).to.equal('Systolic Blood Pressure');
      expect(browser.isExisting('#formSysBP input')).to.be.true;
      expect(browser.getText('#formDiabetic .button_form__prompt')).to.equal('Diabetes');
      expect(browser.getValue('#formDiabetic .button_form__left .button_form__btn')).to.equal('No');
      expect(browser.getValue('#formDiabetic .button_form__right .button_form__btn')).to.equal('Yes');
      expect(browser.getText('#formSmoker .button_form__prompt')).to.equal('Current Smoking');
      expect(browser.getValue('#formSmoker .button_form__left .button_form__btn')).to.equal('No');
      expect(browser.getValue('#formSmoker .button_form__right .button_form__btn')).to.equal('Yes');
      expect(browser.getText('#formHypertensive .button_form__prompt')).to.equal('Treatment for Hypertension');
      expect(browser.getValue('#formHypertensive .button_form__left .button_form__btn')).to.equal('No');
      expect(browser.getValue('#formHypertensive .button_form__right .button_form__btn')).to.equal('Yes');
      expect(browser.isExisting('.send_form__btn')).to.be.true;
      expect(browser.getValue('.send_form__btn')).to.equal('See Risk Score');
      expect(browser.isExisting('#formDiabetic .button_form__required')).to.be.true;
      expect(browser.getText('.send_form__right')).to.equal('The following are required to compute ASCVD risk: Diabetes');
    });

    it('Handles workflow of submitting the form accordingly', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('.send_form__btn', 3000);
      expect($('.send_form__btn').getAttribute('disabled')).to.equal('true');
      browser.click('#formDiabetic .button_form__right .button_form__btn');
      expect($('.send_form__active').isExisting()).to.be.true;
      expect($('.send_form__btn').getValue()).to.equal('See Risk Score');
      browser.click('.send_form__btn');
      browser.click('.navbar__one');
      expect($('.send_form__btn').getValue()).to.equal('Update Risk Score');
    });

    it('Hides and displays the Navigation Bar appropriately', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('.navbar__hidden', 3000);
      browser.click('#formDiabetic .button_form__right .button_form__btn');
      browser.click('.send_form__btn');
      expect(browser.isExisting('.navbar__container')).to.be.true;
    });

    it('Disables and enables Navigation Bar buttons appropriately', () => {
      browser.url(`http://${localAddress}:8080/results.html`);
      browser.waitForExist('.navbar__hidden', 3000);
      browser.click('#formDiabetic .button_form__right .button_form__btn');
      browser.click('.send_form__btn');
      expect($('.navbar__one').getValue()).to.equal('Results');
      expect($('.navbar__one.navbar__default').isExisting()).to.be.true;
      expect($('.navbar__two').getValue()).to.equal('Risk Factors');
      expect($('.navbar__two.navbar__active').isExisting()).to.be.true;
      expect($('.navbar__three').getValue()).to.equal('Recommendations');
      expect($('.navbar__three.navbar__default').isExisting()).to.be.true;
      browser.click('.navbar__one');
      browser.click('#formDiabetic .button_form__left .button_form__btn');
      expect($('.navbar__active').getValue()).to.equal('Results');
      expect($('.navbar__two.navbar__disabled').isExisting()).to.be.true;
      expect($('.navbar__three.navbar__disabled').isExisting()).to.be.true;
    });

    it('Displays a graph with necessary content', () => {
      browser.url(`http://${localAddress}:8080/riskfactors.html`);
      browser.waitForExist('.send_form__active', 3000);
      browser.click('.send_form__active');
      expect($$('.graph_bar__bar').length).to.equal(4);
      expect($('.graph__ten-year-group .graph__bar-label').getText()).to.equal('10 Year Risk');
      expect($('.graph__lifetime-group .graph__bar-label').getText()).to.equal('Lifetime Risk');
      expect($('.graph__graph-title').getText()).to.equal('Chance of heart attack or stroke');
      expect($('.graph__yaxis').getText()).to.equal('100\n80\n60\n40\n20\n0');
      expect($('.graph__label').getText()).to.equal('Percent (%)');
      expect($('.graph__legend-container').getText()).to.equal('Current Risk\nLowest Possible Risk');
    });

    it('Displays content for interactive risk factors', () => {
      browser.url(`http://${localAddress}:8080/riskfactors.html`);
      browser.waitForExist('label[for="option_two"] input', 3000);
      browser.click('label[for="option_two"] input');
      browser.waitForExist('#formSex .button_form__right button', 3000);
      browser.click('#formSex .button_form__right button');
      browser.setValue('#formAge .input_text_form__text-entry', '75');
      browser.click('.send_form__active');
      expect($('.simulated_risk__bar-labels').getText()).to.contain('Current Risk\n51.7%');
      expect($('.simulated_risk__bar-labels').getText()).to.contain('Potential Risk\n51.7%');
      expect($('.simulated_risk__bar-labels').getText()).to.contain('Lowest Possible Risk\n8.5%\n0%');
      expect($('.risk_action__prompt').getText()).to.equal('Explore how different actions could reduce your risk of heart attack or stroke');
      expect($('.risk_action__input-area').getText()).to.contain('Take a statin');
      expect($('.risk_action__input-area').getText()).to.contain('Control your blood pressure');
      expect($('.risk_action__input-area').getText()).to.contain('Take aspirin every day');
      expect($('.risk_action__input-area').getText()).to.contain('Quit smoking');
      browser.click('label[for="aspirin"] input');
      expect($('.simulated_risk__bar-labels').getText()).to.contain('Current Risk\n51.7%');
      expect($('.simulated_risk__bar-labels').getText()).to.contain('Potential Risk\n46.5%');
      expect($('.simulated_risk__bar-labels').getText()).to.contain('Lowest Possible Risk\n8.5%\n0%');
      expect($('.simulated_risk__bar-potential-risk').isExisting()).to.be.true;
      expect($('.simulated_risk__bar-current-risk').isExisting()).to.be.true;
      expect($('.simulated_risk__bar-lowest-risk').isExisting()).to.be.true;
      browser.click('label[for="sysBP"] input');
      browser.click('label[for="smoker"] input');
      expect($('.simulated_risk__bar-current-risk').getHTML()).to.contain('0px');
    });

    it('Displays only relevant simulated risk actions', () => {
      browser.url(`http://${localAddress}:8080/riskfactors.html`);
      browser.waitForExist('#formSysBP .input_text_form__text-entry', 3000);
      browser.setValue('#formSysBP .input_text_form__text-entry', '130');
      browser.click('#formSmoker .button_form__left .button_form__btn');
      browser.click('.send_form__active');
      expect($('label[for="sysBP"]').getCssProperty('display')['value']).to.equal('none');
      expect($('label[for="smoker"]').getCssProperty('display')['value']).to.equal('none');
    });

    it('Displays 3-column and 1-column results view accordingly', () => {
      browser.url(`http://${localAddress}:8080/riskfactors.html`);
      browser.waitForExist('.send_form__active', 3000);
      browser.click('.send_form__active');
      browser.click('.navbar__one');
      browser.setViewportSize({
          width: 861,
          height: 1000
      });
      expect($('.index__grouped-column').getCssProperty('display')['value']).to.equal('inline-block');
      expect($('.navbar__container').getCssProperty('text-align')['value']).to.equal('start');
      browser.setViewportSize({
          width: 860,
          height: 1000
      });
      expect($('.index__grouped-column').getCssProperty('width')['value']).to.equal('180px');
      expect($('.index__grouped-column').getCssProperty('display')['value']).to.equal('block');
      expect($('.navbar__container').getCssProperty('text-align')['value']).to.equal('center');
    });

    it('Risk Factors view responds in width to accommodate display width', () => {
      browser.url(`http://${localAddress}:8080/riskfactors.html`);
      browser.waitForExist('.send_form__active', 3000);
      browser.click('.send_form__active');
      browser.setViewportSize({
          width: 861,
          height: 1000
      });
      expect($('.graph__graph-border').getCssProperty('width')['value']).to.equal('600px');
      expect($('.graph_bar__bar').getCssProperty('width')['value']).to.equal('100px');
      expect($('.simulated_risk__bar-total').getCssProperty('width')['value']).to.equal('100px');
      browser.setViewportSize({
          width: 860,
          height: 1000
      });
      expect($('.graph__graph-border').getCssProperty('width')['value']).to.equal('520px');
      expect($('.graph_bar__bar').getCssProperty('width')['value']).to.equal('80px');
      expect($('.simulated_risk__bar-total').getCssProperty('width')['value']).to.equal('80px');
      browser.setViewportSize({
          width: 700,
          height: 1000
      });
      expect($('.graph__graph-border').getCssProperty('width')['value']).to.equal('155px');
      expect($('.graph_bar__bar').getCssProperty('width')['value']).to.equal('20px');
      expect($('.simulated_risk__bar-total').getCssProperty('width')['value']).to.equal('40px');
    });

    it('Recommendations view with content', () => {
      browser.url(`http://${localAddress}:8080/recommendations.html`);
      browser.waitForExist('.send_form__active', 3000);
      browser.click('.send_form__active');
      browser.click('.navbar__three');
      expect($('#recSmoker .detail_box__title').getText()).to.contain('Quit Smoking');
      expect($('#recSmoker .detail_box__description').getText()).to.contain('Besides causing cancer and lung disease, smoking');
      expect($('#recSmoker .detail_box__description').getText()).to.contain('is a leading cause of stroke and heart attack. Nicotine replacement (patches, gum, lozenges),');
      expect($('#recSmoker .detail_box__description').getText()).to.contain('coaching programs, and medications (Chantix®, bupropion) can increase your chances of success.');
      expect($('#recSmoker .detail_box__description').getText()).to.contain('See www.smokefree.gov for more information.');
      expect($('#recStatin .detail_box__title').getText()).to.contain('Consider a statin');
      expect($('#recStatin .detail_box__description').getText()).to.contain('Statins can reduce your risk of heart attack or');
      expect($('#recStatin .detail_box__description').getText()).to.contain('stroke by 25%, even if your cholesterol level is in the “normal” range. The American Heart');
      expect($('#recStatin .detail_box__description').getText()).to.contain('Association and American College of Cardiology recommend statins for people with diabetes, prior');
      expect($('#recStatin .detail_box__description').getText()).to.contain('heart disease or stroke, and people at high risk of developing heart disease.');
      expect($('#recAspirin .detail_box__title').getText()).to.contain('Aspirin');
      expect($('#recAspirin .detail_box__description').getText()).to.contain('Aspirin can help lower your risk of heart attack');
      expect($('#recAspirin .detail_box__description').getText()).to.contain('or stroke by about 10%. Aspirin may increase your risk of bleeding. Talk to your doctor about');
      expect($('#recAspirin .detail_box__description').getText()).to.contain('whether you may benefit from taking aspirin daily and what dose may be the best.');
      expect($('#recBP .detail_box__title').getText()).to.contain('Control your blood pressure');
      expect($('#recBP .detail_box__description').getText()).to.contain('Every 10 point lowering of your systolic blood pressure');
      expect($('#recBP .detail_box__description').getText()).to.contain('or 5 point lowering of your diastolic blood pressure can lower your risk of heart disease by 21%. High blood');
      expect($('#recBP .detail_box__description').getText()).to.contain('pressure can be treated with diet, weight loss, and medications. Lowering your sodium intake to 2,400 mg per');
      expect($('#recBP .detail_box__description').getText()).to.contain('pressure can be treated with diet, weight loss, and medications. Lowering your sodium intake to 2,400 mg per');
      expect($('#recBP .detail_box__description').getText()).to.contain('different goal blood pressures. Ask your doctor what your goal should be.');
      expect($('#recExercise .detail_box__title').getText()).to.contain('Exercise More');
      expect($('#recExercise .detail_box__description').getText()).to.contain('The American Heart Association and American College');
      expect($('#recExercise .detail_box__description').getText()).to.contain('of Cardiology recommend 3-4 sessions per week of at least 40 minutes per session of moderate to vigorous');
      expect($('#recExercise .detail_box__description').getText()).to.contain('physical activity. But even small increases in your amount of physical activity can improve your heart health.');
      expect($('#recEating .detail_box__title').getText()).to.contain('Eat more Heart-Healthy Food');
      expect($('#recEating .detail_box__description').getText()).to.contain('Try to limit your intake of sugar, including sweets');
      expect($('#recEating .detail_box__description').getText()).to.contain('and sugar sweetened drinks. Eating more vegetables, fruits, whole grains, low-fat dairy, poultry (chicken),');
      expect($('#recEating .detail_box__description').getText()).to.contain('fish, beans, olive oil and nuts can help lower your risk of heart disease. Try to avoid or reduce trans fat and');
      expect($('#recEating .detail_box__description').getText()).to.contain('saturated fat, which are high in lard, butter, red meat, and fried foods.');
      browser.click('#recSmoker .detail_box__header');
      expect($('#recSmoker .detail_box__collapsed').getCssProperty('display')['value']).to.equal('none');
      expect($('#recSmoker .detail_box__title').getCssProperty('display')['value']).to.equal('inline-block');
    });

    it('Risk Factors view responds in print request', () => {
      browser.url(`http://${localAddress}:8080/riskfactors.html`);
      browser.waitForExist('.send_form__active', 3000);
      browser.click('.send_form__active');
      browser.execute((function pretendToBeAPrinter() {
        //For looking up if something is in the media list
        function hasMedia(list, media) {
          if (!list) { return false; }

          var i = list.length;
          while (i--) {
            if (list[i] === media) {
              return true;
            }
          }
          return false;
        }

        //Loop though all stylesheets
        for (var styleSheetNo = 0; styleSheetNo < document.styleSheets.length; styleSheetNo++) {
          //Current stylesheet
          var styleSheet = document.styleSheets[styleSheetNo];

          //First, check if any media queries have been defined on the <style> / <link> tag

          //Disable screen-only sheets
          if (hasMedia(styleSheet.media, "screen") && !hasMedia(styleSheet.media, "print")) {
            styleSheet.disabled = true;
          }

          //Display "print" stylesheets
          if (!hasMedia(styleSheet.media, "screen") && hasMedia(styleSheet.media, "print")) {
            //Add "screen" media to show on screen
            styleSheet.media.appendMedium("screen");
          }

          //Get the CSS rules in a cross-browser compatible way
          var rules = styleSheet.rules || styleSheet.cssRules;

          //Handle cases where styleSheet.rules is null
          if (!rules) {
            continue;
          }

          //Second, loop through all the rules in a stylesheet
          for (var ruleNo = 0; ruleNo < rules.length; ruleNo++) {
            //Current rule
            var rule = rules[ruleNo];

            //Hide screen-only rules
            if (hasMedia(rule.media, "screen") && !hasMedia(rule.media, "print")) {
              //Rule.disabled doesn't work here, so we remove the "screen" rule and add the "print" rule so it isn't shown
              rule.media.appendMedium(':not(screen)');
              rule.media.deleteMedium('screen');
            }

            //Display "print" rules
            if (!hasMedia(rule.media, "screen") && hasMedia(rule.media, "print")) {
              //Add "screen" media to show on screen
              rule.media.appendMedium("screen");
            }
          }
        }
      }));

      expect($('.graph__legend-label').getCssProperty('display')['value']).to.equal('none');
      expect($('.graph__legend-bar').getCssProperty('display')['value']).to.equal('none');
      expect($('.graph_bar__lowest-possible-risk').getCssProperty('background-color')['value']).to.equal('rgba(0,0,0,0)');
      expect($('.graph_bar__lowest-possible-risk').getCssProperty('border')['value']).to.equal('3px solid rgb(45, 53, 57)');
      expect($('.graph_bar__current-risk').getCssProperty('background-color')['value']).to.equal('rgba(0,0,0,0)');
      expect($('.graph_bar__current-risk').getCssProperty('border')['value']).to.equal('3px solid rgb(111, 116, 119)');
      expect($('.graph__ten-year-group').getText()).to.contain('Current Risk');
      expect($('.graph__ten-year-group').getText()).to.contain('Lowest Possible Risk');
      expect($('.simulated_risk__bar-lowest-risk').getCssProperty('background-color')['value']).to.equal('rgba(0,0,0,0)');
      expect($('.simulated_risk__bar-current-risk').getCssProperty('background-color')['value']).to.equal('rgba(0,0,0,0)');
      expect($('.simulated_risk__bar-potential-risk').getCssProperty('background-color')['value']).to.equal('rgba(0,0,0,0)');
      expect($('.simulated_risk__bar-current-risk').getCssProperty('width')['value']).to.equal('50px');
      expect($('.simulated_risk__bar-potential-risk').getCssProperty('width')['value']).to.equal('25px');
    });
  });
});
