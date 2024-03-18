import React from 'react';
import '../index.less';

export default function Dialog(props: any) {
	return (
		props.visible && (
			<div className="container">
				<div className="content">{props.content}</div>
				<div
					className="btn"
					onClick={() => {
						props.close();
					}}
				>
					关闭
				</div>
			</div>
		)
	);
}
