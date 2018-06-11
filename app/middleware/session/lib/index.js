'use strict';

const RedisStore = require('./store/store_redis');
const MysqlStore = require('./store/store_mysql');
const debug = require('debug')('rain-session');
const cookie = require('cookie');
const signature = require('cookie-signature');

// session store can be a session store class
class Session {
  constructor(app,{redis, mysql, name = 'sessionid', path = '/', domain}) {
    this.WECHAT_H5_AUTHORIZE = 'wechat_h5_authorize';

    this.app = app;
    this.name = name;
    this.name = name;
    this.path = path;
    this.store = redis ? new RedisStore(redis, app) : (mysql ? new MysqlStore(mysql, app) : '');

    if (mysql && !mysql.session_table) throw new Error('There is no session_table for session in mysql.');
    if (!this.store) throw new Error('There is no store_type for session .');
    this.domain = domain;

  }


  getcookie() {
    let {ctx, name} = this;
    let header = ctx.headers.cookie, raw, val;

    // read from cookie header
    if (header) {
      var cookies = cookie.parse(header);

      raw = cookies[name];

      if (raw) {
        if (raw.substr(0, 2) === 's:') {
          val = raw.slice(2);

          if (val === false) {
            debug('cookie signature invalid');
            val = undefined;
          }
        } else {
          debug('cookie unsigned')
        }
      }
    }
    // back-compat read from cookieParser() signedCookies data
    if (!val && ctx.signedCookies) {
      val = ctx.signedCookies[name];

      if (val) {
        deprecate('cookie should be available in ctx.headers.cookie');
      }
    }

    // back-compat read from cookieParser() cookies data
    if (!val && ctx.cookies) {
      raw = ctx.cookies[name];

      if (raw) {
        if (raw.substr(0, 2) === 's:') {
          val = raw.slice(2);

          if (val) {
            deprecate('cookie should be available in ctx.headers.cookie');
          }

          if (val === false) {
            debug('cookie signature invalid');
            val = undefined;
          }
        } else {
          debug('cookie unsigned')
        }
      }
    }

    return val;
  }


  /**
   * Determine if request is secure.
   *
   * todo: 研究研究这个方法是干啥的
   *
   * @param {Object} ctx
   * @param {Boolean} [trustProxy]
   * @return {Boolean}
   * @private
   */

  issecure(ctx, trustProxy) {
    // socket is https server
    if (ctx.connection && ctx.connection.encrypted) {
      return true;
    }

    // do not trust proxy
    if (trustProxy === false) {
      return false;
    }

    // no explicit trust; try ctx.secure from express
    if (trustProxy !== true) {
      var secure = ctx.secure;
      return typeof secure === 'boolean'
        ? secure
        : false;
    }

    // read the proto from x-forwarded-proto header
    var header = ctx.headers['x-forwarded-proto'] || '';
    var index = header.indexOf(',');
    var proto = index !== -1
      ? header.substr(0, index).toLowerCase().trim()
      : header.toLowerCase().trim()

    return proto === 'https';
  }


  async session(ctx, next) {

    let {store, type, name} = this;
    this.ctx = ctx;
    let cookieId = ctx.sessionID = this.getcookie() || '00dlp7fbi9at4w3p5dmbjn3ieene10lp';  //todo:
    ctx.logger.info('=================================cookieId', cookieId)

    debug('cookieId', cookieId)

    // self-awareness
    if (ctx.session && ctx.session.user && ctx.session.user.user_id) {
      return next();
    } else {
      if (!cookieId) {
        debug('cookie 签名错误，或者没有cookie')
        ctx.status = 401
        return ctx.body = 401002; // todo: 定义详细的错误码
      }

      try {
        let {session_key, session_data, expire_date} = await store.get(cookieId);

        // session不存在，
        if (!session_data || (expire_date <= new Date() && expire_date !== 0)) {
          debug('session不存在或已过期')
          ctx.status = 401
          return ctx.body = 401002; // todo: 定义详细的错误码
        } else {
          debug('session found %j', session_data);
          ctx.session = JSON.parse(new Buffer(session_data, 'base64').toString().replace(/^\w{40}:/, ''))
          ctx.session.user_id = ctx.session._auth_user_id;
          ctx.session.origin_user_id = ctx.session._origin_user_id || ctx.session._auth_user_id;   //todo: 这里的user_id一定要整清楚
          ctx.session.system_user_id = ctx.session._system_user_id;
          ctx.logger.info('=================================user_id, origin_user_id, system_user_id', ctx.session.user_id, ctx.session.origin_user_id, ctx.session.system_user_id)

          if (!ctx.session.user_id) {
            debug('session 错误')
            ctx.status = 401          // todo: 前端遇401自行登录
            return ctx.body = 401002; // todo: 定义详细的错误码
          }
          debug('session data', ctx.session)
        }
      } catch (err) {
        ctx.logger.error(err);
        ctx.status = 500;           // todo: 前端遇500需要提供合理的提示，同时要上报
        return ctx.body = 500133;  // todo: 定义相关的错误码
      }

      await next();
    }
  }


}

module.exports = Session;
