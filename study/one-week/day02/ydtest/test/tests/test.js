module.exports = {
    'Demo test Baidu' : function (browser) {
      browser
        .url('www.baidu.com')
        .waitForElementVisible('body', 1000)
        .setValue('input[name=wd]', 'NightWatch')
        .click('#su')
        .pause(1000)
        .assert.containsText('#container', 'NightWatch')
        .end();
    }
  };