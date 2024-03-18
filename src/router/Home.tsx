import React, { memo } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { routerList } from '../utils/index';
const Home = memo(() => {
	const navigate = useNavigate();

	const onClick = () => {
		navigate('/about?id=dds', { replace: true, state: '你好帅' });
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
			<button onClick={onClick}>点击跳转</button>
			<div>Home</div>
			<NavLink
				to="child1"
				className={({ isActive, isPending }) =>
					isPending ? 'pending' : isActive ? 'active' : ''
				}
			>
				child1
			</NavLink>
			<NavLink
				to="child2"
				className={({ isActive, isPending }) =>
					isPending ? 'pending' : isActive ? 'active' : ''
				}
			>
				child2
			</NavLink>
			<Outlet />
		</>
	);
});

export default Home;
