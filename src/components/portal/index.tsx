import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Dialog from './components/Dialog';

const Portal = (props: any) => {
	const [content, setContent] = useState(new Date().toString());
	const [dialogVisible, setDialogVisible] = useState(false);

	const div = document.createElement('div');
	document.body.appendChild(div);
	console.log('render');

	return (
		<div>
			{createPortal(
				<Dialog
					visible={dialogVisible}
					content={content}
					close={() => {
						setDialogVisible(false);
					}}
				>
					{content}
				</Dialog>,
				div
			)}
			<button
				onClick={() => {
					setContent(new Date().toString());
					setDialogVisible(true);
				}}
			>
				弹出消息
			</button>
		</div>
	);
};

export default Portal;
