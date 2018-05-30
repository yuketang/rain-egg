const isJSON = require('koa-is-json');
const zlib = require('zlib');
const debug = require('debug')('middleware/access.js');

module.exports = options => {
  return async function sessionCheck(ctx, next) {
    debug.info(ctx.path);
    await next();

    debug.info(ctx.body);

    ctx.logger.info();
  };
};
