const { exec, escape } = require('../db/mysql');
const { getPassword } = require('../utils/cryp');

const login = (username, password) => {
    // 生成加密密码
    password = getPassword(password);
    username = escape(username);
    password = escape(password);
    const sql = `select * from users where username=${username} and password=${password};`;
    return exec(sql).then((rows) => {
        return rows[0] || {};
    });
};

const register = (username, password) => {
    password = getPassword(password);
    username = escape(username);
    password = escape(password);
    // const sql = `insert into users (username,password) values (${username},${password});`;
    // return exec(sql).then((rows) => {
    //     return rows[0] || {};
    // });
    const sql = `select username from users where username=${username};`;
    return exec(sql).then((rows) => {
        if (rows[0]) {
            return rows[0];
        } else {
            exec(
                `insert into users (username,password) values (${username},${password});`
            );
            return {};
        }
    });
};

const del = (id) => {
    username = escape(id);
    const sql = `delete from users where id=${id};`;
    // const sql = `delete from users where username=${username};`;
    return exec(sql).then((rows) => {
        return rows[0] || {};
    });
};

const update = (username, id) => {
    username = escape(username);
    const sql = `update users set username = ${username} where id=${id};`
    return exec(sql).then((updateData) => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

const getUserList = (username, password) => {
    username = escape(username);
    password = escape(password);
    const sql = `select * from users;`;
    return exec(sql).then((rows) => {
        return rows || {};
    });
};

module.exports = {
    login,
    register,
    del,
    update,
    getUserList,
};