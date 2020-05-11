const {
    getCaseList,
    getCaseDetail,
    newCase,
    upDateCase,
    delCase,
} = require('../controller/case');

const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'));
    }
};

const handleCaseRouter = (req, res) => {
    const id = req.query.id;
    if (req.method === 'GET' && req.path === '/api/case/list') {
        let author = req.query.author || '';
        const keyword = req.query.keyword || '';
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)
        const id = req.query.id || '';
        if (req.query.isadmin) {
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) {
                return loginCheckResult;
            }
            author = req.session.username;
        }
        const result = getCaseList(author, keyword, id);
        return result.then((listData) => {
            return new SuccessModel(listData);
        });
    }

    if (req.method === 'GET' && req.path === '/api/case/detail') {
        const result = getCaseDetail(id);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/case/add') {
        // 设置假数据，登陆的时候使用登陆的时候的author

        const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }

        req.body.author = req.session.username;
        const result = newCase(req.body);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/case/update') {
        const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }
        const result = upDateCase(req.body.id, req.body);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel();
        });
    }

    if (req.method === 'DELETE' && req.path === '/api/case/del') {
        // const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }

        const author = req.session.username;

        const result = delCase(id, author);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel('删除case失败！');
        });
    }
};

module.exports = handleCaseRouter;