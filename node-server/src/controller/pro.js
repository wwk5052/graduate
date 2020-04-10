const xss = require('xss');

const { exec } = require('../db/mysql');

const getProList = (author, keyword) => {
    // 1=1 起到一个占位的作用，增加容错，防止author和keyword没有值
    let sql = `select * from products where 1=1 `;
    // if (author) {
    //     sql += `and author='${author}' `;
    // }
    // if (keyword) {
    //     sql += `and title like '${keyword}' `;
    // }
    // 根据createtime进行倒序排列
    sql += `order by createtime desc;`;
    // 返回promise
    return exec(sql);
};

const getProDetail = (id) => {
    const sql = `select * from products where id='${id}';`;
    return exec(sql).then((rows) => {
        return rows[0];
    });
};

const newPro = (proData = {}) => {
    const title = xss(proData.title);
    const content = proData.content;
    const author = proData.author;
    const imgurl = proData.imgurl;
    const createTime = Date.now();
    const sql = `insert into products (title, content, createtime, imgurl) values ('${title}', '${content}', '${createTime}', '${imgurl}');`;
    return exec(sql).then((insertData) => {
        return {
            id: insertData.insertId,
        };
    });
};

const upDatePro = (id, proData = {}) => {
    const title = proData.title;
    const content = proData.content;
    const imgurl = proData.imgurl;
    const createTime = Date.now();
    const sql = `update products set title='${title}', content='${content}',imgurl='${imgurl}',createtime='${createTime}' where id ='${id}';`;
    return exec(sql).then((updateData) => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

const delPro = (id, author) => {
    const sql = `delete from products where id='${id}';`;
    // const sql = `delete from products where id='${id}' and author='${author}';`;
    return exec(sql).then((delData) => {
        if (delData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

module.exports = {
    getProList,
    getProDetail,
    newPro,
    upDatePro,
    delPro,
};