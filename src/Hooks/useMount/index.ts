import { useEffect } from 'react';

type noop = () => void;

export default function useMount<T extends noop>(fn: T) {
	useEffect(() => {
		fn && fn();
	}, []);
}
