import { MutableRefObject } from 'react';
import { FetchState, Options, Service, Subscribe } from './type';

export default class NewFetch<TData, TParams extends any[]> {
	state: FetchState<TData, TParams> = {
		loading: false,
		params: undefined,
		data: undefined,
		error: undefined
	};

	constructor(
		public serviceRef: MutableRefObject<Service<TData, TParams>>,
		public options: Options<TData, TParams>,
		public subscribe: Subscribe
	) {
		this.state = {
			...this.state,
			loading: !options.manual
		};
	}

	setState(s: Partial<FetchState<TData, TParams>> = {}) {
		this.state = {
			...this.state,
			...s
		};
		this.subscribe();
	}

	async runAsync(...params: TParams): Promise<TData> {
		this.setState({
			loading: true,
			params
		});

		try {
			const res = await this.serviceRef.current(...params);
			this.setState({
				loading: false,
				data: res,
				error: undefined
			});
			return res;
		} catch (error: any) {
			this.setState({
				loading: false,
				data: undefined,
				error
			});
			return new Promise((_, reject) => {
				reject(error);
			});
		}
	}

	run(...params: TParams) {
		this.runAsync(...params).catch((error) => {
			console.error(error);
		});
	}
}
