module.exports = appInfo => {
  return {
    root_router: '',
    // root_router:  '/cms/getup',
    origin: '*',
    config_env: 'local',
    onerror: {
      all(err, ctx) {
        // console.log('=================================err', err)

        // 在此处定义针对所有响应类型的错误处理方法
        // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
        ctx.body = 'error';
        ctx.status = 500;
      },
    },

  };
};
