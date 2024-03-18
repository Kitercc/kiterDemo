const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const APP_DIR = path.resolve(__dirname, '../src');
module.exports = {
	entry: {
		main: APP_DIR
	},
	resolve: {
		alias: {
			'@': path.resolve(process.cwd(), 'src')
		},
		extensions: ['.tsx', '.js', '.ts']
	},
	output: {
		filename: 'static/js/[name].js', // 每个输出js的名称
		path: path.join(__dirname, '../dist'), // 打包结果输出路径
		clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
		publicPath: '/' // 打包后文件的公共前缀路径
	},
	module: {
		rules: [
			{
				oneOf: [
					{
						test: /.(css|less)$/, //匹配 css和less 文件
						use: [
							'style-loader',
							'css-loader',
							{
								loader: 'postcss-loader',
								options: {
									postcssOptions: {
										plugins: ['autoprefixer']
									}
								}
							},
							'less-loader'
						]
					},
					{
						test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								// 预设执行顺序由右往左,所以先处理ts,再处理jsx
								presets: ['@babel/preset-react', '@babel/preset-typescript']
							}
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../public/index.html'), // 模板取定义root节点的模板
			inject: true // 自动注入静态资源
		})
	]
};
