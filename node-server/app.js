const querystring = require('querystring');
const {get, set } = require('./src/db/redis');
const { access } = require('./src/utils/log');
const handleUserRouter = require('./src/router/user');
const handleCaseRouter = require('./src/router/case');
const handleNewRouter = require('./src/router/new');
const handleProRouter = require('./src/router/pro');
const handleMessageRouter = require('./src/router/message');
const handleTodoRouter = require('./src/router/todo')
    // 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    console.log('d.toGMTString() is ', d.toGMTString());
    return d.toGMTString();
};

// // session 数据
// const SESSION_DATA = {}

// 用于处理 post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        // if (req.headers['content-type'] !== 'application/json') {
        //     resolve({});
        //     return;
        // }
        if (!req.headers['content-type'].includes('application/json')) {
            console.log('进来了');
            resolve({});
            return;
        }
        let postData = '';
        req.on('data', (chunk) => {
            postData += chunk.toString();
        });
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(JSON.parse(postData));
        });
    });
    return promise;
};

const serverHandle = (req, res) => {
    // 记录 access log
    access(
        `${req.method} -- ${req.url} -- ${
      req.headers['user-agent']
    } -- ${Date.now()}`
    );

    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json');

    // 获取 path
    const url = req.url;
    req.path = url.split('?')[0];

    // 解析 query
    req.query = querystring.parse(url.split('?')[1]);

    // 解析 cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || ''; // k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach((item) => {
        if (!item) {
            return;
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    });

    // // 解析 session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    // 解析 session （使用 redis）
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        // 初始化 redis 中的 session 值
        set(userId, {});
    }
    // 获取 session
    req.sessionId = userId;
    get(req.sessionId)
        .then((sessionData) => {
            if (sessionData == null) {
                // 初始化 redis 中的 session 值
                set(req.sessionId, {});
                // 设置 session
                req.session = {};
            } else {
                // 设置 session
                req.session = sessionData;
            }
            // console.log('req.session ', req.session)

            // 处理 post data
            return getPostData(req);
        })
        .then((postData) => {
            req.body = postData;
            const caseResult = handleCaseRouter(req, res);
            // 处理case的路由
            if (caseResult) {
                caseResult.then((caseData) => {
                    if (needSetCookie) {
                        res.setHeader(
                            'Set-Cookie',
                            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
                        );
                    }

                    res.end(JSON.stringify(caseData));
                });
                return;
            }
            // 处理newResult的路由
            const newResult = handleNewRouter(req, res);
            if (newResult) {
                newResult.then((newData) => {
                    if (needSetCookie) {
                        res.setHeader(
                            'Set-Cookie',
                            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
                        );
                    }

                    res.end(JSON.stringify(newData));
                });
                return;
            }
            // 处理pro的路由
            const proResult = handleProRouter(req, res);
            if (proResult) {
                proResult.then((proData) => {
                    if (needSetCookie) {
                        res.setHeader(
                            'Set-Cookie',
                            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
                        );
                    }
                    res.end(JSON.stringify(proData));
                });
                return;
            }
            // message处理路由
            const messageResult = handleMessageRouter(req, res);
            if (messageResult) {
                messageResult.then(messageData => {
                    if (needSetCookie) {
                        res.setHeader(
                            'Set-Cookie',
                            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
                        );
                    }
                    res.end(JSON.stringify(messageData))
                });
                return;
            }
            // 处理todo list 路由
            const todoListResult = handleTodoRouter(req, res);
            if (todoListResult) {
                todoListResult.then(todoData => {
                    if (needSetCookie) {
                        res.setHedader(
                            `Set-Cookie`,
                            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
                        );
                    }
                    res.end(JSON.stringify(todoData))
                });
                return;
            }
            // 处理user的路由
            const userResult = handleUserRouter(req, res);
            if (userResult) {
                userResult.then((userData) => {
                    if (needSetCookie) {
                        res.setHeader(
                            'Set-Cookie',
                            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
                        );
                    }

                    res.end(JSON.stringify(userData));
                });
                return;
            }

            // 未命中路由，返回 404
            res.writeHead(404, { 'Content-type': 'text/plain' });
            res.write('404 Not Found\n');
            res.end();
        });
};

module.exports = serverHandle;

// process.env.NODE_ENV