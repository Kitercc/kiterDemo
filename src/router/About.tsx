import React, { memo, useEffect } from 'react';
import { routerList } from '../utils';
import {
	NavLink,
	useLocation,
	useParams,
	useSearchParams
} from 'react-router-dom';

const MyComponent = () => {
	return (
		<>
			<input type="text" />
		</>
	);
};

const About = memo(() => {
	console.log('当前运行环境：' + process.env.NODE_ENV);

	const aa = useLocation();
	const bb = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		console.log(aa, bb, searchParams);
	}, []);
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
			<h2>about</h2>
		</>
	);
});

export default About;
