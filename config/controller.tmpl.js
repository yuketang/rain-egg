'use strict';
/**
 文档： https://eggjs.org/zh-cn/basics/controller.html
 Controller 的用途
    1. 获取用户通过 HTTP 传递过来的请求参数。
    2. 校验、组装参数。
    3. 调用 Service 进行业务处理，必要时处理转换 Service 的返回结果，让它适应用户的需求。
    4. 通过 HTTP 将结果响应给用户。
 */

const Controller = require('../core/base_controller');

/**
 * 如果不需要某个方法，则注释掉即可
 */
class EggController extends Controller {
  // GET xxxx/articles
  async index() {
    const { ctx } = this;
    ctx.body = `path: ${ctx.path}; func: index`;
  }

  // GET xxxx/articles/new
  async new() {
    const { ctx } = this;
    ctx.body = `path: ${ctx.path}; func: new`;
  }

  // POST xxxx/articles
  async create() {
    const { ctx } = this;
    ctx.body = `path: ${ctx.path}; func: create`;
  }

  // GET xxxx/articles/:id
  async show() {
    const { ctx } = this;
    ctx.body = `path: ${ctx.path}; func: show`;
  }

  // GET xxxx/articles/:id/edit
  async edit() {
    const { ctx } = this;
    ctx.body = `path: ${ctx.path}; func: edit`;
  }

  // PUT xxxx/articles/:id
  async update() {
    const { ctx } = this;
    ctx.body = `path: ${ctx.path}; func: update`;
  }

  // DELETE xxxx/articles/:id
  async destroy() {
    const { ctx } = this;
    ctx.body = `path: ${ctx.path}; func: destroy`;
  }


}

module.exports = EggController;
