const {
    getMessageList,
    getMessageDetail,
    newMessage,
    upDateMessage,
    delMessage,
} = require('../controller/message');

const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'));
    }
};

const handleCaseRouter = (req, res) => {
    const id = req.query.id;
    if (req.method === 'GET' && req.path === '/api/message/list') {
        let author = req.query.author || '';
        const keyword = req.query.keyword || '';
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)
        const status = req.query.status || 0;
        if (req.query.isadmin) {
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) {
                return loginCheckResult;
            }
            author = req.session.username;
        }
        const result = getMessageList(author, keyword, status);
        return result.then((listData) => {
            return new SuccessModel(listData);
        });
    }

    if (req.method === 'GET' && req.path === '/api/message/detail') {
        const result = getMessageDetail(id);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/message/add') {
        // 设置假数据，登陆的时候使用登陆的时候的author

        const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }

        req.body.author = req.session.username;
        const result = newMessage(req.body);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/message/update') {
        const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }
        console.log('这是req.body', req.body)
        const result = upDateMessage(req.body.id, req.body);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel();
        });
    }

    if (req.method === 'DELETE' && req.path === '/api/message/del') {
        // const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }

        const author = req.session.username;

        const result = delMessage(id, author);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel('删除message失败！');
        });
    }
};

module.exports = handleCaseRouter;