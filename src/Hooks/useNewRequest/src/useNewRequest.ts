import { Options, Service } from './type';
import useNewRequestImplement from './useNewRequestImplement';

function useNewRequest<TData, TParams extends any[]>(
	service: Service<TData, TParams>,
	options?: Options<TData, TParams>
) {
	return useNewRequestImplement<TData, TParams>(service, options);
}

export default useNewRequest;
