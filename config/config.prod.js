module.exports = appInfo => {
  return {
    root_router: '',
    // root_router:  '/cms/getup',
    origin: '*',
    config_env: 'local',
    notfound: {
      pageUrl: '/404.html',
    },
    onerror: {
      errorPageUrl: '/500.html',
    },
  };
};
