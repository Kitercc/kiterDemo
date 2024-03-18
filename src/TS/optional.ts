import { Artical, Demo } from '.';

type PartialOpatins<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type GetPartialOptions<T> = {
	[P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};

type Eg1 = PartialOpatins<Artical, 'author' | 'date'>;

type Eg2 = GetPartialOptions<Demo>;

function aa(aa: Eg1) {}
