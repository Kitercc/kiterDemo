/**
 * 获取T为函数的key
 */

/**
 * @desc NonUndefined判断T是否为undefined
 */
type NonUndefined<T> = T extends undefined ? never : T;

/**
 * @desc 核心实现
 */
type FunctionKeys<T extends object> = {
	[K in keyof T]: NonUndefined<T[K]> extends Function ? K : never;
}[keyof T];

/**
 * @example
 * type Eg = 'key2' | 'key3';
 */
type AType = {
	key1: string;
	key2: () => void;
	key3: Function;
};
type Eag = FunctionKeys<AType>;
