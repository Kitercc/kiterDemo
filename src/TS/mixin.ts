/**单个提问数据结构 */
// interface QsData {
// 	avator?: string;
// 	time?: number | string;
// 	name?: string;
// 	quesitons: {
// 		title: string;
// 		picture: string[];
// 	};
// }

/**单个回答数据结构 */
// interface AsData {
// 	avator?: string;
// 	time?: number | string;
// 	name?: string;
// 	answers: {
// 		text: string;
// 		audio?: {
// 			url: string;
// 			total: number;
// 		};
// 	};
// }

// 头像接口类型
interface DataAvator {
	avator?: string;
	time?: number | string;
	name?: string;
}

// 提问数据接口类型
interface Qs {
	quesitons: {
		title: string;
		picture: string[];
	};
}

// 问题接口数据类型
interface As {
	answers: {
		text: string;
		audio?: {
			url: string;
			total: number;
		};
	};
}

type Mixin<T, K> = T & K;
interface A {
	name: string;
	age: number;
}

interface B {
	name: string;
	id: string;
}

type Union = A | B;
const c: Union = {
	name: 'test',
	age: 25,
	id: '352342462652'
};

type Union2 = A & B;

const d: Union2 = {
	name: 'test',
	age: 25,
	id: '352342462652'
};
