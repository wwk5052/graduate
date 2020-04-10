const xss = require('xss');

const { exec } = require('../db/mysql');

const getCaseList = (author, keyword) => {
    // let sql = `select * from blogs where 1=1 `
    // 1=1 起到一个占位的作用，增加容错，防止author和keyword没有值
    let sql = `select * from cases where 1=1 `;
    if (author) {
        sql += `and author='${author}' `;
    }
    if (keyword) {
        sql += `and title like '${keyword}' `;
    }
    // 根据createtime进行倒序排列
    sql += `order by createtime desc;`;
    // 返回promise
    return exec(sql);
};

const getCaseDetail = (id) => {
    const sql = `select * from cases where id='${id}';`;
    return exec(sql).then((rows) => {
        return rows[0];
    });
};

const newCase = (caseData = {}) => {
    const title = xss(caseData.title);
    const content = caseData.content;
    const author = caseData.author;
    const imgurl = caseData.imgurl;
    const createTime = Date.now();
    const sql = `insert into cases (title, content, createtime, imgurl) values ('${title}', '${content}', '${createTime}', '${imgurl}');`;
    return exec(sql).then((insertData) => {
        return {
            id: insertData.insertId,
        };
    });
};

const upDateCase = (id, caseData = {}) => {
    const title = caseData.title;
    const content = caseData.content;
    const imgurl = caseData.imgurl;
    const sql = `update cases set title='${title}', content='${content}',imgurl='${imgurl}'where id ='${id}';`;
    return exec(sql).then((updateData) => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

const delCase = (id, author) => {
    // const sql = `delete from cases where id='${id}' and author='${author}';`;
    const sql = `delete from cases where id='${id}';`;
    return exec(sql).then((delData) => {
        if (delData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

module.exports = {
    getCaseList,
    getCaseDetail,
    newCase,
    upDateCase,
    delCase,
};