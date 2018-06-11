'use strict';

const mock = require('egg-mock');

describe('test/rain-i18n.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/rain-i18n-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, rainI18n')
      .expect(200);
  });
});
