const xss = require('xss');

const { exec } = require('../db/mysql');

const getNewsList = (author, keyword) => {
    // let sql = `select * from blogs where 1=1 `
    // 1=1 起到一个占位的作用，增加容错，防止author和keyword没有值
    let sql = `select * from news where 1=1 `;
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

const getNewsDetail = (id) => {
    const sql = `select * from news where id='${id}';`;
    return exec(sql).then((rows) => {
        return rows[0];
    });
};

const createNews = (newsData = {}) => {
    const title = xss(newsData.title);
    const content = newsData.content;
    const author = newsData.author;
    const imgurl = newsData.imgurl;
    const type = newsData.type;
    const createTime = Date.now();
    const sql = `insert into news (title, content, createtime, imgurl,type) values ('${title}', '${content}', '${createTime}', '${imgurl}','${type}');`;
    return exec(sql).then((insertData) => {
        return {
            id: insertData.insertId,
        };
    });
};

const upDateNews = (id, newsData = {}) => {
    const title = xss(newsData.title);
    const content = newsData.content;
    const author = newsData.author;
    const imgurl = newsData.imgurl;
    const type = newsData.type;
    const createTime = Date.now();
    const sql = `update news set title='${title}', content='${content}',imgurl='${imgurl}',type='${type}',createtime='${createTime}' where id ='${id}';`;
    return exec(sql).then((updateData) => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

const delNews = (id, author) => {
    const sql = `delete from news where id='${id}';`;
    // const sql = `delete from news where id='${id}' and author='${author}';`;
    return exec(sql).then((delData) => {
        if (delData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

module.exports = {
    getNewsList,
    getNewsDetail,
    createNews,
    upDateNews,
    delNews,
};