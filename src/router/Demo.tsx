import React, { useTransition, useState, useMemo, useEffect } from 'react';
import { routerList } from '../utils';
import { NavLink } from 'react-router-dom';
function Demo() {
	console.log('当前运行环境：' + process.env.NODE_ENV);

	const [val, setVal] = useState('');
	const [arr, setArr] = useState<number[]>([]);
	const [pending, transition] = useTransition();
	const getList = (e: any) => {
		setVal(e.target.value);
		let arr = Array.from(new Array(10000), (item) => Date.now());
		transition(() => {
			setArr(arr);
		});
	};

	return (
		<>
			{routerList.map((item) => (
				<NavLink
					key={item.id}
					to={`${item.path}${item.id == 'about' ? '?id=dds' : ''}`}
					className={({ isActive, isPending }) =>
						isPending ? 'pending' : isActive ? 'active' : ''
					}
				>
					{item.id}
				</NavLink>
			))}
			<h2>这是我的界面</h2>
			<div>
				<input value={val} onChange={getList} />
				{pending ? (
					<h2>loading....</h2>
				) : (
					arr.map((item, key) => <div key={key}>{item}</div>)
				)}
			</div>
		</>
	);
}
export default Demo;
