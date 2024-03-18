import { useNewRequest, useRequest } from '@/Hooks';
import Mock from 'mockjs';
import React from 'react';

function getUsername(value: string): Promise<string> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(Mock.mock('@name') + value);
			// reject(`这里有错误哦${value}`);
		}, 1000);
	});
}

export default () => {
	const { data, error, loading, params, run, runAsync } = useNewRequest(
		getUsername,
		{
			manual: true
		}
	);
	console.log(params);

	if (error) {
		return <div>{error as unknown as string}</div>;
	}
	if (loading) {
		return <div>loading...</div>;
	}
	return (
		<>
			<button onClick={() => run('22')} disabled={loading}>
				{loading ? '获取中' : 'run'}
			</button>
			<button onClick={() => runAsync('22')} disabled={loading}>
				{loading ? '获取中' : 'runAsync'}
			</button>
			<div>Username: {data}</div>
		</>
	);
};
