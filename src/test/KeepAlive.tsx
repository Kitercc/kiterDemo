import React, { useState } from 'react';
import {
	KeepaliveItem,
	KeepaliveScope,
	useCacheDestory
} from '@/components/reactKeepalive';

function CompNumber() {
	const [isShow, setShow] = useState(true);
	return (
		<div>
			{isShow && (
				<KeepaliveItem cacheId="aa">
					<Demo />
				</KeepaliveItem>
			)}
			<button onClick={() => setShow(!isShow)}>
				show {isShow ? 'hidden' : 'show'}
			</button>
		</div>
	);
}

function Demo() {
	const [number, setNumber] = useState(0);
	return (
		<>
			current:{number}
			<br />
			<button onClick={() => setNumber(number + 1)}>add</button>
			<button onClick={() => setNumber(number - 1)}>del--</button>
		</>
	);
}

export default function KeepAlive() {
	const [isShow, setShow] = useState(true);
	return (
		<KeepaliveScope>
			{/* <button onClick={() => setShow(!isShow)}>
				show {isShow ? 'hidden' : 'show'}
			</button>
			{isShow && (
				<KeepaliveItem cacheId="aa">
					<Demo />
				</KeepaliveItem>
			)} */}
			<CompNumber />
		</KeepaliveScope>
	);
}
