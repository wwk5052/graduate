const {
    getTodoList,
    getTodoDetail,
    newTodo,
    upDateTodo,
    delTodo,
} = require('../controller/todo');

const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'));
    }
};

const handleTodoRouter = (req, res) => {
    const id = req.query.id;
    if (req.method === 'GET' && req.path === '/api/todo/list') {
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
        const result = getTodoList(author, keyword, id);
        return result.then((listData) => {
            return new SuccessModel(listData);
        });
    }

    if (req.method === 'GET' && req.path === '/api/todo/detail') {
        const result = getTodoDetail(id);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/todo/add') {
        // 设置假数据，登陆的时候使用登陆的时候的author

        const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }

        req.body.author = req.session.username;
        const result = newTodo(req.body);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    if (req.method === 'POST' && req.path === '/api/todo/update') {
        const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }
        console.log('这是req.body', req.body)
        const result = upDateTodo(req.body.id, req.body);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel();
        });
    }

    if (req.method === 'DELETE' && req.path === '/api/todo/del') {
        // const loginCheckResult = loginCheck(req);
        // if (loginCheckResult) {
        //     //未登录
        //     return loginCheckResult;
        // }

        const author = req.session.username;

        const result = delTodo(id, author);
        return result.then((val) => {
            return val ? new SuccessModel() : new ErrorModel('删除todo失败！');
        });
    }
};

module.exports = handleTodoRouter;