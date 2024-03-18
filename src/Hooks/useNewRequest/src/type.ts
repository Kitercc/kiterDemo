import Fetch from '@/Hooks/useRequest/src/Fetch';
import type { DependencyList } from 'react';

export type Service<TData, TParams extends any[]> = (
	...args: TParams
) => Promise<TData>;
export type Subscribe = () => void;

// for Fetch

export interface FetchState<TData, TParams extends any[]> {
	loading: boolean;
	params?: TParams;
	data?: TData;
	error?: Error;
}

// for useRequestImplement

export interface Options<TData, TParams extends any[]> {
	manual?: boolean;
	defaultParams?: TParams;
}

export interface Result<TData, TParams extends any[]> {
	loading: boolean;
	data?: TData;
	error?: Error;
	params: TParams | [];
	cancel: Fetch<TData, TParams>['cancel'];
	refresh: Fetch<TData, TParams>['refresh'];
	refreshAsync: Fetch<TData, TParams>['refreshAsync'];
	run: Fetch<TData, TParams>['run'];
	runAsync: Fetch<TData, TParams>['runAsync'];
	mutate: Fetch<TData, TParams>['mutate'];
}

export type Timeout = ReturnType<typeof setTimeout>;
