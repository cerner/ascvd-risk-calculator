Terra.viewports().forEach((viewport) => {
  describe('Component', () => {
    it('asdf', () => {
      browser.pause(3000);
      browser.url('http://0.0.0.0:8080');
      // const paragraph = $('//body/container')
      // console.log(paragraph.getHTML());
      browser.pause(3000);

      browser.saveScreenshot('something.png');

      // console.log(browser.getTitle());
      // console.log(Object.getOwnPropertyNames(browser).filter(function (p) {
      //   return typeof browser[p] === 'function';
      // }));

      // browser.getUrl('http://localhost:8080');
      // browser.waitForExist('loading-indicator');
      // expect(browser.isExisting('loading-indicator')).to.be.true;
      // browser.waitForExist('.ErrorView__error-view', 10000);
      // expect(browser.isExisting('.ErrorView__error-view')).to.be.true;
    });
  });

});
