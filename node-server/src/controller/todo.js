const xss = require('xss');

const { exec } = require('../db/mysql');

const getTodoList = (author, keyword, id) => {
    // let sql = `select * from blogs where 1=1 `
    // 1=1 起到一个占位的作用，增加容错，防止author和keyword没有值
    let sql = `select * from todolist where 1=1 `;
    if (author) {
        sql += `and author='${author}' `;
    }
    if (keyword) {
        sql += `and title like '${keyword}' `;
    }
    if (id) {
        sql += `and id=${id} `;
    }
    // 根据createtime进行倒序排列
    sql += `order by createtime desc;`;
    // 返回promise
    return exec(sql);
};

const getTodoDetail = (id) => {
    const sql = `select * from todolist where id='${id}';`;
    return exec(sql).then((rows) => {
        return rows[0];
    });
};

const newTodo = (messageData = {}) => {
    const title = xss(messageData.title);
    const status = messageData.status;
    const createTime = Date.now();
    const sql = `insert into todolist (title, createtime, status) values ('${title}', '${createTime}', '${status ? 1 : 0}');`;
    return exec(sql).then((insertData) => {
        return {
            id: insertData.insertId,
        };
    });
};

const upDateTodo = (id, messageData = {}) => {
    const title = messageData.title;
    const status = messageData.status;
    const sql = `update todolist set title='${title}',status='${status? 1 : 0}'where id ='${id}';`;
    return exec(sql).then((updateData) => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

const delTodo = (id, author) => {
    // const sql = `delete from todolist where id='${id}' and author='${author}';`;
    const sql = `delete from todolist where id='${id}';`;
    return exec(sql).then((delData) => {
        if (delData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

module.exports = {
    getTodoList,
    getTodoDetail,
    newTodo,
    upDateTodo,
    delTodo,
};