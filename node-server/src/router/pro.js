const {
    getProList,
    getProDetail,
    newPro,
    upDatePro,
    delPro,
} = require('../controller/pro');

const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'));
    }
};

const handleProRouter = (req, res) => {
    const id = req.query.id;
    if (req.method === 'GET' && req.path === '/api/pro/list') {
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
        const result = getProList(author, keyword);
        return result.then((listData) => {
            return new SuccessModel(listData);
        });
    }

    if (req.method === 'GET' && req.path === '/api/pro/detail') {
        const result = getProDetail(id);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/pro/add') {
        // 设置假数据，登陆的时候使用登陆的时候的author
        // const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }
        req.body.author = req.session.username;
        const result = newPro(req.body);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/pro/update') {
        // const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }
        const result = upDatePro(req.body.id, req.body);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel();
        });
    }

    if (req.method === 'DELETE' && req.path === '/api/pro/del') {
        // const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }

        const author = req.session.username;
        const result = delPro(id, author);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel('删除产品失败！');
        });
    }
};

module.exports = handleProRouter;