import { Artical } from '.';

// First of Array
type arr1 = ['a', 'b', 'c'];
type arr2 = [3, 2, 1];

type head1 = First<arr1>; // expected to be 'a'
type head2 = First<arr2>; // expected to be 3

// Last of Array
type arr3 = ['a', 'b', 'c'];
type arr4 = [3, 2, 1];

type tail1 = Last<arr3>; // expected to be 'c'
type tail2 = Last<arr4>; // expected to be 1

type First<T extends any[]> = T extends [infer first, ...infer rest]
	? first
	: never;

type Last<T extends any[]> = T extends [...infer rest, infer last]
	? last
	: never;

// type ProfilerOnRenderCallback = (
// 	id: string,
// 	phase: 'mount' | 'update',
// 	actualDuration: number,
// 	baseDuration: number,
// 	startTime: number,
// 	commitTime: number,
// 	interactions: any
// ) => void;

// type TransformToObjectType<T extends (...args: any[]) => void> = T extends (
// 	...args: infer U
// ) => void
// 	? {
// 			[K in keyof U]: U[K];
// 	  }
// 	: never;

// type TransformArrayToObject<T extends any[]> = T extends [infer A, ...infer R]
// 	? { [K in keyof A]: A[K] } & TransformArrayToObject<R>
// 	: {};

// type aa = TransformToObjectType<ProfilerOnRenderCallback>;

// type cc = TransformArrayToObject<
// 	TransformToObjectType<ProfilerOnRenderCallback>
// >;
