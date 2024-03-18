import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Home from './Home';
import Detail from './Detail';
import Demo from './Demo';
import Child1 from '../components/child/Child1';
import Child2 from '../components/child/Child2';
import About from './About';
import Main from './Main';

function Router() {
	return useRoutes([
		{
			path: '/home',
			caseSensitive: true,
			element: <Home />,
			children: [
				{ path: 'child1', caseSensitive: true, element: <Child1 /> },
				{ path: 'child2', caseSensitive: true, element: <Child2 /> }
			]
		},
		{
			path: '/detail',
			caseSensitive: true,
			element: <Detail />
		},
		{
			path: '/about',
			caseSensitive: true,
			element: <About />
		},
		{
			path: '/demo',
			element: <Demo />
		},
		{
			path: '/main',
			element: <Main />
		},
		{
			path: '/',
			element: <Navigate replace to="/main" />
		}
	]);
}

export default Router;
