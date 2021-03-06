'use strict';

const ip = require('ip');
const fs = require('fs');
const path = require('path');

/**
 * 文档： https://eggjs.org/api/config_config.default.js.html
 * 说明：config 默认加载 config.default.js, config.{env}.js , config.{env}.js 会覆盖 config.default.js 中的同名配置
 *
 config
 |- config.default.js
 |- config.test.js
 |- config.prod.js
 |- config.unittest.js
 `- config.local.js
 *
 */
module.exports = appInfo => {
    const config = {
        tracelog: {
            Tracer: require('../lib/Tracer.js'),
        },
        tracer: {
            Class: require('../lib/Tracer.js'),
        },
        static: {
            prefix: '',
            dir: path.join(appInfo.baseDir, 'app/public'),
            dynamic: true,
            preload: false,
            maxAge: 31536000,
            buffer: false,
        },
        // coreMiddleware: [
        //   'first',
        //   'meta',
        //   'siteFile',
        //   'fmtResponse',
        //   'accessLog',
        //   'error404',
        //   'bodyParser',
        //   'overrideMethod',
        // ],
        siteFile: {
            '/favicon.ico': fs.readFileSync(path.join(__dirname, 'favicon.ico')),
        },
        maxAge: 86400000, // Session 的最大有效时间

        // middleware: ['accessLog'], // 框架中不能配置，配置需要的中间件，数组顺序即为中间件的加载顺序，名字为文件名,驼峰命名，不支持下划线命名
        // accessLog: {                // 配置 gzip 中间件的配置
        //     enable: true, //控制中间件是否开启。
        // },
        customLogger: {
            accessLogger: {
                file: path.join(appInfo.baseDir, `logs/${appInfo.name}-access.log`),
            },
        },
        error404: { // 配置 gzip 中间件的配置
            enable: false, // 控制中间件是否开启。
        },
        sessionCheck: { // 配置 gzip 中间件的配置
            enable: false, // 控制中间件是否开启。
        },
        gzip: { // 配置 gzip 中间件的配置
            enable: false, // 控制中间件是否开启。
            threshold: 1024, // 小于 1k 的响应体不压缩
            match: '', // 设置只有符合某些规则的请求才会经过这个中间件。
            ignore: '', // 设置符合某些规则的请求不经过这个中间件。
        },
        security: {
            // csrf: {
            //     enable: false,
            // },
            domainWhiteList: () => { // 允许跨域白名单
                const ports = [ '', 7001, 9000, 9001 ];
                const protocols = [ '', 'http', 'https' ];
                const domains = [ '', ip.address(), 'localhost', '127.0.0.1', 'b.yuketang.cn', 'www.yuketang.cn', 'yuketang.cn', 'ykt.io', 'www.ykt.io' ];
                const domainWhiteList = [];
                domains.forEach(domain => {
                    ports.forEach(port => {
                        protocols.forEach(protocol => {
                            if (port) {
                                domainWhiteList.push(`${protocol}://${domain}:${port}`);
                            } else {
                                domainWhiteList.push(`${protocol}://${domain}${port}`);
                            }
                        });
                    });
                });
                return domainWhiteList;
            },
        },
        cors: { // 允许跨域
            allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
            credential: true,
            exposeHeaders: '',
            allowHeaders: 'X_Requested_With, If-Modified-Since, User-Agent, Referer, Content-Type, Range, Content-Length, Authorization, Accept,X-Requested-With,X-Token',
            maxAge: 24 * 60 * 60, // 预检有效期
            // origin: '*' // 这个设置之后 security.domainWhiteList 就不起作用了
        },
        logger: {
            dir: path.join(appInfo.baseDir || '', 'logs'),
            // outputJSON: true,
            // level: 'NONE',          // 文件打印日志级别，NONE为不打印
            consoleLevel: 'DEBUG', // 终端日志级别

            appLogName: `${appInfo.name}-app.log`,
            coreLogName: `${appInfo.name}-core.log`,
            agentLogName: `${appInfo.name}-agent.log`,
            errorLogName: `${appInfo.name}-error.log`,
        },
        logrotator: { // 切割日志
            filesRotateByHour: [ 'app', 'core', 'agent', 'error' ].map(item => path.join(appInfo.baseDir, 'logs', `${appInfo.name}-${item}.log`)), // 按小时切割日志
        },
        bodyParser: {
            jsonLimit: '10mb', // default: 100kb
            formLimit: '10mb', // default: 100kb
        },
        redis: {
            enable: true, // 开启或关闭插件
            // 是否加载到 app 上，默认开启
            app: true,
            // 是否加载到 agent 上，默认关闭
            agent: false,
            client: {
                cluster: true,
                nodes: [
                    { port: 37000, host: '10.0.0.117', password: null, db: 0 },
                    { port: 37001, host: '10.0.0.117', password: null, db: 0 },
                    { port: 37002, host: '10.0.0.117', password: null, db: 0 },
                ],
            },
        },
        sequelize: {
            storage: 'main.db',
            dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
            database: 'blended_learning',
            host: 'localhost',
            port: '3306',
            username: 'django',
            password: 'QHFvCa7gC4HWAf',
        },
        mysql: {
            enable: true, // 开启或关闭插件
            package: 'egg-mysql', // package为一个npm模块，package.json中的dependencies中，框架会在node_modules目录中找到这个插件入口
            // 单数据库信息配置
            client: {
                // host
                host: '10.0.0.117',
                // 端口号
                port: '3306',
                // 用户名
                user: 'django',
                // 密码
                password: 'QHFvCa7gC4HWAf',
                // 数据库名
                database: 'blended_learning',
            },
            // 是否加载到 app 上，默认开启
            app: true,
            // 是否加载到 agent 上，默认关闭
            agent: false,
        },
        multipart: {
            fileExtensions: [ '.apk' ], // 增加对 .apk 扩展名的支持
            whitelist: [ '.png' ], // 覆盖整个白名单，只允许上传 '.png' 格式; 当传递了 whitelist 属性时，fileExtensions 属性不生效。
            /** 默认支持的白名单
             // images
             '.jpg', '.jpeg', // image/jpeg
             '.png', // image/png, image/x-png
             '.gif', // image/gif
             '.bmp', // image/bmp
             '.wbmp', // image/vnd.wap.wbmp
             '.webp',
             '.tif',
             '.psd',
             // text
             '.svg',
             '.js', '.jsx',
             '.json',
             '.css', '.less',
             '.html', '.htm',
             '.xml',
             // tar
             '.zip',
             '.gz', '.tgz', '.gzip',
             // video
             '.mp3',
             '.mp4',
             '.avi',
             */
        },
        jsonp: {
            callback: 'callback', // 识别 query 中的 `callback` 参数, 默认 _callback
            limit: 100, // 函数名最长为 100 个字符
            csrf: true, // 如果在同一个主域之下，可以通过开启 CSRF 的方式来校验 JSONP 请求的来源
            whiteList: /^https?:\/\/test.com\//, // 如果想对其他域名的网页提供 JSONP 服务，我们可以通过配置 referrer 白名单的方式来限制 JSONP 的请求方在可控范围之内
            // whiteList: '.test.com',
            // whiteList: 'sub.test.com',
            // whiteList: [ 'sub.test.com', 'sub2.test.com' ],

        },
        httpclient: {
            enableDNSCache: false,
            dnsCacheMaxLength: 1000,
            dnsCacheMaxAge: 10000,
            request: {
                timeout: 5000,
            },
            httpAgent: {
                keepAlive: true,
                freeSocketKeepAliveTimeout: 4000,
                maxSockets: Number.MAX_SAFE_INTEGER,
                maxFreeSockets: 256,
            },
            httpsAgent: {
                keepAlive: true,
                freeSocketKeepAliveTimeout: 4000,
                maxSockets: Number.MAX_SAFE_INTEGER,
                maxFreeSockets: 256,
            },
        },
        // httpclient : {
        //     // 是否开启本地 DNS 缓存，默认关闭，开启后有两个特性
        //     // 1. 所有的 DNS 查询都会默认优先使用缓存的，即使 DNS 查询错误也不影响应用
        //     // 2. 对同一个域名，在 dnsCacheLookupInterval 的间隔内（默认 10s）只会查询一次
        //     enableDNSCache: false,
        //     // 对同一个域名进行 DNS 查询的最小间隔时间
        //     dnsCacheLookupInterval: 10000,
        //     // DNS 同时缓存的最大域名数量，默认 1000
        //     dnsCacheMaxLength: 1000,
        //
        //     request: {
        //         // 默认 request 超时时间
        //         timeout: 3000,
        //     },
        //
        //     httpAgent: {
        //         // 默认开启 http KeepAlive 功能
        //         keepAlive: true,
        //         // 空闲的 KeepAlive socket 最长可以存活 4 秒
        //         freeSocketKeepAliveTimeout: 4000,
        //         // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
        //         timeout: 30000,
        //         // 允许创建的最大 socket 数
        //         maxSockets: Number.MAX_SAFE_INTEGER,
        //         // 最大空闲 socket 数
        //         maxFreeSockets: 256,
        //     },
        //
        //     httpsAgent: {
        //         // 默认开启 https KeepAlive 功能
        //         keepAlive: true,
        //         // 空闲的 KeepAlive socket 最长可以存活 4 秒
        //         freeSocketKeepAliveTimeout: 4000,
        //         // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
        //         timeout: 30000,
        //         // 允许创建的最大 socket 数
        //         maxSockets: Number.MAX_SAFE_INTEGER,
        //         // 最大空闲 socket 数
        //         maxFreeSockets: 256,
        //     },
        // },
        meta: {
            enable: true,
            logging: true,
        },
    };

  config.i18n = {
    // 默认语言，默认 "en_US"
    defaultLocale: 'en',
    // URL 参数，默认 "locale"
    queryField: 'locale',
    // Cookie 记录的 key, 默认："locale"
    // cookieField: 'locale',
    // Cookie 默认 `1y` 一年后过期， 如果设置为 Number，则单位为 ms
    // cookieMaxAge: '1y',
  };

    config.HEADER_LANGUAGE = 'X-Language';
    return config;
};
