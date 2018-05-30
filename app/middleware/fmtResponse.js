module.exports = () => {
    return async function language(ctx, next) {
      let {header} = ctx;
      let language = header[ctx.config.HEADER_LANGUAGE];

      await next();

      if(typeof ctx.body === 'number'){
        // ctx.body=0 接口正确无需返回其他信息  ==》转换成 {errcode: 0, errmsg: "ok"}
        ctx.body = {errcode: ctx.body, errmsg: ctx.__(ctx.body)}
      }else if(ctx.body.errcode >= 0){
          // ctx.body={errcode: 0, errmsg: "用户操作成功"}   ==》转换成 {errcode: 0, errmsg: "用户操作成功"}； 注意如果写死了errmsg将不做国际化转换，直接输出给定的errmsg
          // ctx.body={errcode: 400000}   ==》转换成 {errcode: 400000, errmsg: "参数错误"}； 注意如果写死了errmsg将不做国际化转换，直接输出给定的errmsg
          ctx.body.errmsg = ctx.body.errmsg || ctx.__(ctx.errcode)
      }else {
          if(Object.keys(ctx.body) >1 && ctx.body.data){
              // ctx.body={"aaa": "的说法发","BBB": "fdfdfs", "data": {"ccc":"sdkfflaj"}}   ==》转换成 {errcode: 0, errmsg: "ok", data: {"aaa": "的说法发","BBB": "fdfdfs", "data": {"ccc":"sdkfflaj"}}}
              ctx.body = {errcode: 0, errmsg: ctx.__(0), data: ctx.body}
          }else if(Object.keys(ctx.body) <= 1 && ctx.body.data){
              // ctx.body={"data": {"ccc":"sdkfflaj"}}   ==》转换成 {errcode: 0, errmsg: "ok", data: {"ccc":"sdkfflaj"}}
              ctx.body = {errcode: 0, errmsg: ctx.__(0), data: ctx.body.data}
          }else{
              // ctx.body={"aaa": "的说法发","BBB": "fdfdfs"}   ==》转换成 {errcode: 0, errmsg: "ok", data: {"aaa": "的说法发","BBB": "fdfdfs"}}
              ctx.body = {errcode: 0, errmsg: ctx.__(0), data: ctx.body}
          }
      }



      // if (ctx.status === 404 && !ctx.body) {
      //     if (ctx.acceptJSON) {
      //         ctx.body = { error: 'Not Found' };
      //     } else {
      //         ctx.body = '<h1>Page Not Found</h1>';
      //     }
      // }
    };
};
