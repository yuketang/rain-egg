'use strict';

module.exports = app => {
  // 将 rainI18n 中间件放到 bodyParser 之前
  const index = app.config.coreMiddleware.indexOf('meta');
  const index_i18n = app.config.coreMiddleware.indexOf('i18n');
  console.log('===================1==============app.config.coreMiddleware', app.config.coreMiddleware)

  app.config.coreMiddleware.splice(index_i18n, 1);
  console.log('====================2=============app.config.coreMiddleware', app.config.coreMiddleware)
};
