const {
    getNewsList,
    getNewsDetail,
    createNews,
    upDateNews,
    delNews,
} = require('../controller/new');

const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'));
    }
};

const handleNewRouter = (req, res) => {
    const id = req.query.id;
    if (req.method === 'GET' && req.path === '/api/new/list') {
        let author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const type = req.query.type || 1;
        const id = req.query.id || '';
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)
        if (req.query.isadmin) {
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) {
                return loginCheckResult;
            }
            author = req.session.username;
        }
        const result = getNewsList(author, keyword, type, id);
        return result.then((listData) => {
            return new SuccessModel(listData);
        });
    }

    if (req.method === 'GET' && req.path === '/api/new/detail') {
        const result = getNewsDetail(id);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/new/create') {
        // 设置假数据，登陆的时候使用登陆的时候的author

        const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }

        req.body.author = req.session.username;
        const result = createNews(req.body);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/new/update') {
        const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }
        const result = upDateNews(req.body.id, req.body);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel();
        });
    }

    if (req.method === 'DELETE' && req.path === '/api/new/del') {
        const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }

        const author = req.session.username;
        const result = delNews(id, author);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel('删除新闻失败！');
        });
    }
};

module.exports = handleNewRouter;