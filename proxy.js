const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// 启用 CORS
app.use(cors());

// 配置代理
const setupProxy = (targetUrl) => {
    return createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: {
            // '^/api': '/api', // 移除 /api 前缀
        },
        onProxyRes: function (proxyRes, req, res) {
            console.log('sss', req.headers)
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        },
    });
};

const targetUrl = 'https://shop.huanghanlian.com/api'

// 动态设置代理目标
app.use('/api/v1/*', async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.json({
        aaa: '111',
        bbb: await fetch('https://shop.huanghanlian.com/api/feed').then(res => res.json())  
    })
    console.log(`Proxying to: ${targetUrl}`);

    const proxy = setupProxy(targetUrl);
    return proxy(req, res, next);
});

// 动态设置代理目标
app.use('/api/v2/*', async (req, res, next) => {
    const proxy = setupProxy(targetUrl);
    return proxy(req, res, next);
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});