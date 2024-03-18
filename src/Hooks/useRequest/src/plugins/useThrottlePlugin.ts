import type { DebouncedFunc, ThrottleSettings } from 'lodash';
import { throttle } from 'lodash';
import { useEffect, useRef } from 'react';
import type { Plugin } from '../types';

const useThrottlePlugin: Plugin<any, any[]> = (
	fetchInstance,
	{ throttleWait, throttleLeading, throttleTrailing }
) => {
	const throttledRef = useRef<DebouncedFunc<any>>();

	const options: ThrottleSettings = {};
	if (throttleLeading !== undefined) {
		options.leading = throttleLeading;
	}
	if (throttleTrailing !== undefined) {
		options.trailing = throttleTrailing;
	}

	useEffect(() => {
		if (throttleWait) {
			const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance);

			throttledRef.current = throttle(
				(callback: any) => {
					callback();
				},
				throttleWait,
				options
			);

			fetchInstance.runAsync = (...args) => {
				return new Promise((resolve, reject) => {
					throttledRef.current?.(() => {
						_originRunAsync(...args)
							.then(resolve)
							.catch(reject);
					});
				});
			};

			return () => {
				fetchInstance.runAsync = _originRunAsync;
				throttledRef.current?.cancel();
			};
		}
	}, [throttleWait, throttleLeading, throttleTrailing]);

	if (!throttleWait) {
		return {};
	}

	return {
		onCancel: () => {
			throttledRef.current?.cancel();
		}
	};
};

export default useThrottlePlugin;
