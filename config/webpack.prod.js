// webpack.prod.js

const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
module.exports = merge(commonConfig, {
	mode: 'production' // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
});
