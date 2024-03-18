import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

const Com = memo(({ onHandelchange }: { onHandelchange: () => void }) => {
	const [aa, setAa] = useState<number>(0);
	console.log('子组件');

	return (
		<>
			<h1>{aa}</h1>
			<button onClick={() => setAa(aa + 1)}>加一</button>
			<button onClick={() => setAa(aa - 1)}>减一</button>
			<button onClick={() => setAa(0)}>重制</button>
			<button onClick={() => onHandelchange()}>重制</button>
		</>
	);
});
const Main = memo(() => {
	const [show, setShow] = useState<boolean>(true);

	const onHandelchange = useCallback(() => {
		console.log(2222);
	}, []);

	console.log('父组件');

	useEffect(() => {
		console.log(aa);
	}, []);

	const aa = useMemo(() => {
		return '2';
	}, []);
	return (
		<>
			<button onClick={() => setShow(!show)}>{!show ? '显示' : '隐藏'}</button>
			{/* {show && (
				<KeepAlive>
					<Com />
				</KeepAlive>
			)} */}
			<Com onHandelchange={onHandelchange} />
		</>
	);
});

export default Main;
