import React, {
	useContext,
	useRef,
	isValidElement,
	cloneElement,
	useEffect,
	useLayoutEffect
} from 'react';
import keepaliveContext from '../core/keepContext';
import {
	ACTION_UPDATE,
	ACITON_CREATED,
	isFuntion,
	ACTION_ACTIVE,
	ACITON_UNACTIVE,
	ACTION_UNACTIVED
} from '../utils';

export function useCacheDestory() {
	return useContext(keepaliveContext).cacheDestory;
}

const renderWithChildren = (children: any) => (mergeProps: any) => {
	const aa = isValidElement(children)
		? cloneElement(children, mergeProps)
		: null;
	return children ? (isFuntion(children) ? children(mergeProps) : aa) : null;
};

interface KeepaliveItemProps {
	children: any;
	cacheId: string;
}

function KeepaliveItem({ children, cacheId }: KeepaliveItemProps) {
	const { cacheDispatch, hasAliveStatus } = useContext(keepaliveContext);
	const first = useRef(false);
	const parentNode = useRef<HTMLDivElement>(null);
	const load = (currentNode: any) => {
		parentNode.current && parentNode.current.appendChild(currentNode);
	};

	const init = () => {
		if (!hasAliveStatus(cacheId)) {
			cacheDispatch({
				type: ACITON_CREATED,
				payload: {
					load,
					cacheId,
					children: renderWithChildren(children)
				}
			});
		}
	};

	!first.current && init();

	/* TODO: 自动生成 cacheId  */
	useLayoutEffect(() => {
		/* 触发更新逻辑 */
		hasAliveStatus(cacheId) !== ACTION_UNACTIVED &&
			first.current &&
			cacheDispatch({
				type: ACTION_UPDATE,
				payload: {
					cacheId,
					children: renderWithChildren(children)
				}
			});
	}, [children]);

	useEffect(() => {
		first.current = true;
		cacheDispatch({
			type: ACTION_ACTIVE,
			payload: {
				cacheId,
				load
			}
		});
		return function () {
			console.log(22222);

			cacheDispatch({
				type: ACITON_UNACTIVE,
				payload: cacheId
			});
		};
	}, []);

	return <div ref={parentNode} />;
}

export default KeepaliveItem;
