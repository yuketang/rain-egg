module.exports = app => {
  require('../lib/httpclient-tracer')(app);
};
