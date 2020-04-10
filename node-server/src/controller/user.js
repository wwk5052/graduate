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
    // const sql = `insert into users (username,password) values (${username},${password});`
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

const del = (username) => {
    username = escape(username);
    const sql = `delete from users where username=${username};`;
    return exec(sql).then((rows) => {
        return rows[0] || {};
    });
};

const update = (username, newname, newpassword) => {
    password = getPassword(newpassword);
    username = escape(username);
    newname = escape(newname);
};

module.exports = {
    login,
    register,
    del,
    update,
};