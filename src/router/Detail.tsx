import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { routerList } from '../utils';
const Detail = memo(() => {
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
			<div>Detail</div>
		</>
	);
});

export default Detail;
