const {
    login,
    register,
    del,
    update,
    getUserList,
} = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { set } = require('../db/redis');

const handleUserRouter = (req, res) => {
    const method = req.method; // GET POST
    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body;
        console.log('denglu', req.body);
        // const { username, password } = req.query
        const result = login(username, password);
        console.log('这是result', result);
        return result.then((data) => {
            console.log('这是data', data);
            if (data.username) {
                // 设置 session
                req.session.username = data.username;
                // 同步到 redis
                set(req.sessionId, req.session);
                return new SuccessModel('登录成功');
            }
            return new ErrorModel('登录失败');
        });
    }

    // 注册
    if (method === 'POST' && req.path === '/api/user/reg') {
        const { username, password } = req.body;
        const result = register(username, password);
        return result.then((data) => {
            if (data.username) {
                return new ErrorModel('用户名已存在');
            }
            return new SuccessModel('注册成功');
        });
    }

    // 删除
    if (method === 'DELETE' && req.path === '/api/user/del') {
        const { username } = req.query;
        const result = del(username);
        return result.then((data) => {
            if (data.username) {
                return new ErrorModel('删除失败');
            }
            return new SuccessModel('删除成功');
        });
    }

    // 更新
    if (method === 'POST' && req.path === '/api/user/update') {
        const { username, newname, newpassword } = req.body;
        const result = update(username, newname, newpassword);
        return result.then((data) => {
            // if (data.username) {
            //     // 设置 session
            //     req.session.username = data.username
            //         // 同步到 redis
            //     set(req.sessionId, req.session)
            // return new SuccessModel('注册成功')
            // }
            // return new ErrorModel('登录失败')
            // console.log('这是注册之后', data)
        });
    }

    // 名单
    if (req.method === 'GET' && req.path === '/api/user/list') {
        let author = req.query.author || '';
        let keyword = req.query.keyword || '';
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)
        // if (req.query.isadmin) {
        //     const loginCheckResult = loginCheck(req);
        //     if (loginCheckResult) {
        //         return loginCheckResult;
        //     }
        //     author = req.session.username;
        // }
        const result = getUserList(author, keyword);
        return result.then((listData) => {
            return new SuccessModel(listData);
        });
    }
};

module.exports = handleUserRouter;