type JSTypeMap = {
	string: string;
	number: number;
	boolean: boolean;
	object: object;
	function: Function;
	symbol: symbol;
	undefined: undefined;
};

type JSTypeName = keyof JSTypeMap;

type argType<T extends JSTypeName[]> = {
	[K in keyof T]: JSTypeMap[T[K]];
};
declare function addImpl<T extends JSTypeName[]>(
	...args: [...T, (...args: argType<T>) => any]
): void;

addImpl('string', 'string', 'number', (a, b, c) => {});
