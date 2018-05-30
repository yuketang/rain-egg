'use strict';

// add you build-in plugin here, example:
// exports.nunjucks = {
//   enable: true,
//   package: 'egg-view-nunjucks',
// };

exports.i18n = {
    enable: true,
    package: 'egg-i18n',
};

exports.validate = {
  enable: false,
  package: 'egg-validate',
};
exports.redis = {
  enable: false,
  package: 'egg-redis',
};
exports.sessionRedis = {
  enable: false,
  package: 'egg-session-redis',
};
exports.sequelize = {
  enable: false,
  package: 'egg-sequelize',
};
exports.tracer = {
  enable: true,
  package: 'egg-tracer',
};
