const xss = require('xss');

const { exec } = require('../db/mysql');

const getMessageList = (author, keyword, status) => {
    // let sql = `select * from blogs where 1=1 `
    // 1=1 起到一个占位的作用，增加容错，防止author和keyword没有值
    let sql = `select * from message where 1=1 `;
    if (author) {
        sql += `and author='${author}' `;
    }
    if (keyword) {
        sql += `and title like '${keyword}' `;
    }
    if (status) {
        sql += `and status=${status} `;
    }
    // 根据createtime进行倒序排列
    sql += `order by createtime desc;`;
    // 返回promise
    return exec(sql);
};

const getMessageDetail = (id) => {
    const sql = `select * from message where id='${id}';`;
    return exec(sql).then((rows) => {
        return rows[0];
    });
};

const newMessage = (messageData = {}) => {
    const title = xss(messageData.title);
    const content = messageData.content;
    const status = messageData.status;
    const createTime = Date.now();
    const sql = `insert into message (title, content, createtime, status) values ('${title}', '${content}', '${createTime}', '${status}');`;
    return exec(sql).then((insertData) => {
        return {
            id: insertData.insertId,
        };
    });
};

const upDateMessage = (id, messageData = {}) => {
    const title = messageData.title;
    const content = messageData.content;
    const status = messageData.status;
    const sql = `update message set title='${title}', content='${content}',status='${status}'where id ='${id}';`;
    return exec(sql).then((updateData) => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

const delMessage = (id, author) => {
    // const sql = `delete from message where id='${id}' and author='${author}';`;
    const sql = `delete from message where id='${id}';`;
    return exec(sql).then((delData) => {
        if (delData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

module.exports = {
    getMessageList,
    getMessageDetail,
    newMessage,
    upDateMessage,
    delMessage,
};