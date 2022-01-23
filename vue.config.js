module.exports = {
    pages: {
        index: {
            //入口
            entry: 'src/main.js',
        },
    },
    lintOnSave:false, //关闭语法检查
    // devServer: {
    //     proxy: {
    //         '/': {
    //             target: 'http://192.168.3.61:3007',
    //             // pathRewrite:{'^/atguigu':''},
    //             ws: true, //用于支持websocket
    //             changeOrigin: true //true：使用源端口号访问；false：欺骗服务器使用代理目的端口号访问｛用于控制请求头的host位置｝
    //         }
    //     }
    // }
    devServer:{
        port: 8244,
        proxy:"http://localhost:3007"
    }
}
