module.exports = {
    apps: [{
        // 生产环境
        name: 'node-server-admin',
        script: './bin/www.js',
        env: {
            NODE_ENV: 'production',
        },
    }, ],
};