import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import RouterConfig from '@/router/index';
function App() {
	return (
		<HashRouter>
			<RouterConfig />
		</HashRouter>
	);
}
export default App;

// import React from 'react';

// export default function App() {
// 	const Clone = React.cloneElement(
// 		<Temp />,
// 		{ key: 123, name: '张三' },
// 		<div>你好世界1</div>,
// 		<div>你好世界2</div>
// 	);
// 	return <div>{Clone}</div>;
// }

// const Temp = (props: any) => {
// 	return (
// 		<div>
// 			<span>你好世界，{props.name}</span>
// 			{props.children}
// 		</div>
// 	);
// };
