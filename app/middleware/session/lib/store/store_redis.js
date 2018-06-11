'use strict';

/**
 * Module dependencies.
 * @private
 */

var Redis = require('ioredis')

class Store {
  constructor(options, app){
    this.store = new Redis.Cluster(options);
    this.app = app;
  }

  async get(sid) {
    let {sequelize} = this;

    this.app.logger.info('=================================sid', sid)

    this.app.logger.info('=================================1111', 1111)
    try {
      let result = await this.store.get(sid);

      // throw new Error('afjkdfnakjflasjf;alsfjsakl;djf;kasdjfal;ksdjf') //todo: 会报404  响应：<h1>404 Not Found</h1>

      // { session_key: '',
      //   session_data: '',
      //   expire_date: ''
      // }
      if(result) return {session_key: sid, session_data: result, expire_date: 0}
      return {};
    } catch (e) {
      //Todo: 处理错误
      this.app.logger.info('=================================e', e)
    }

  }
}

module.exports = Store;
