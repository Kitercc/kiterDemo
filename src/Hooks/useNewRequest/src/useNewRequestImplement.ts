import useLatest from '@/Hooks/useLatest';
import { Options, Result, Service } from './type';
import useUpdate from '@/Hooks/useUpdate';
import useCreation from '@/Hooks/useCreation';
import useMount from '@/Hooks/useMount';
import useUnmount from '@/Hooks/useUnmount';
import NewFetch from './NewFetch';
import useMemoizedFn from '@/Hooks/useMemoizedFn';
function useNewRequestImplement<TData, TParams extends any[]>(
	service: Service<TData, TParams>,
	options: Options<TData, TParams> = {}
) {
	const { manual = false, ...rest } = options;

	const fetchOptions = {
		manual,
		...rest
	};
	const serviceRef = useLatest(service);

	const update = useUpdate();

	const fetchInstance = useCreation(() => {
		return new NewFetch<TData, TParams>(serviceRef, fetchOptions, update);
	}, []);

	useMount(() => {
		if (!manual) {
			// useCachePlugin can set fetchInstance.state.params from cache when init
			const params = fetchInstance.state.params || options.defaultParams || [];
			// @ts-ignore
			fetchInstance.run(...params);
		}
	});

	return {
		loading: fetchInstance.state.loading,
		data: fetchInstance.state.data,
		error: fetchInstance.state.error,
		params: fetchInstance.state.params || [],
		run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
		runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance))
	} as Result<TData, TParams>;
}

export default useNewRequestImplement;
