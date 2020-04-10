const env = process.env.NODE_ENV;

// 配置
let MYSQL_CONF;
let REDIS_CONF;
console.log('这是当前env', env);
if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'wwk123456789',
        port: '3306',
        database: 'admin',
    };
    // redis
    REDIS_CONF = {
        port: 6379,
        host: 'localhost',
    };
}

if (env === 'production') {
    MYSQL_CONF = {
        host: '120.27.232.135',
        user: 'root',
        password: 'Wwk123456..0',
        port: '3306',
        database: 'admin',
    };

    // redis
    REDIS_CONF = {
        port: 6379,
        host: 'localhost',
    };
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF,
};