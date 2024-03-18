// webpack.dev.js
const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// 合并公共配置,并添加开发环境配置
module.exports = merge(commonConfig, {
	mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
	devtool: 'inline-source-map', // 源码调试模式,后面会讲
	plugins: [
		new ReactRefreshWebpackPlugin() // 添加热更新插件
	],
	devServer: {
		client: {
			progress: false,
			overlay: {
				errors: true,
				warnings: false
			}
		},
		port: 3000, // 服务端口号
		compress: false, // gzip压缩,开发环境不开启,提升热更新速度
		hot: true, // 开启热更新，后面会讲react模块热替换具体配置
		historyApiFallback: true, // 解决history路由404问题
		open: true, //是否直接打开浏览器
		static: {
			directory: path.join(__dirname, '../public') //托管静态资源public文件夹
		}
	}
});
