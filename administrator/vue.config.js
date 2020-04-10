const path = require('path');
module.exports = {
    publicPath: '/graduate/administrator/dist', //根路径
    outputDir: 'dist', //打包的时候生成的一个文件名
    assetsDir: 'assets', //静态资源目录(js,css,img,fonts)这些文件都可以写里面
    lintOnSave: false, //是否开启eslint保存检测 ,它的有效值为 true || false || 'error'
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
                    '^/baseUrl': '' //请求的时候使用这个api就可以
                }
            }
        }
    }
};