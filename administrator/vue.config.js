module.exports = {
    // ......
    // 相对路径都是相对于index.js所在的目录config开始的
    // build: {
    //     // index,assetsRoot两个路径基本不用改动，只是用于文件打包存放的路径
    //     // index.html的路径
    //     index: path.resolve(__dirname, '../dist/index.html'),
    //     // js,css,fonts夹等资源的路径
    //     assetsRoot: path.resolve(__dirname, '../dist'),
    //     // 下面这种写法指定静态文件 js/css夹等与index平级
    //     // 指定为'/' 会打包会出现错误，最高只能指定到当前目录’./'  指定目录不存在会自动创建
    //     // 也就是说js,css文件夹的路径其实是上面的: ’../dist' + assetsSubDirectory
    //     assetsSubDirectory: 'static',
    //     // index.html中引用资源的前缀
    //     // 相当于static/js/app.js的前缀 eg： ./static/js...     /static/js.....
    //     assetsPublicPath: '/',
    //     // ......
    // },
    devServer: {
        open: true,
        // host: 'localhost',
        // port: 8081,
        https: false,
        //以上的ip和端口是我们本机的;下面为需要跨域的
        proxy: {
            //配置跨域
            '/baseUrl': {
                target: 'http://localhost:8000/', //这里后台的地址模拟的;应该填写你们真实的后台接口
                ws: true,
                changOrigin: true, //允许跨域
                pathRewrite: {
                    '^/baseUrl': '', //请求的时候使用这个api就可以
                },
            },
        },
    },
};