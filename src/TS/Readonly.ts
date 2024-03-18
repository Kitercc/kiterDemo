interface Artical {
	a: number;
	b: string;
	c: boolean;
	d: {
		e: boolean;
	};
}

type NewReadOnly<T> = {
	readonly [P in keyof T]: T[P];
};

type DeepReadOnly<T> = {
	readonly [P in keyof T]: DeepReadOnly<T[P]>;
};
type ReadonlyOptions<T, K extends keyof T> = Omit<T, K> & {
	[P in K]?: T[P];
};

type PickReadonlyOptions<T, K extends keyof T> = { readonly [P in K]: T[P] };

type Eag1 = NewReadOnly<Artical>;

type Eag2 = PickReadonlyOptions<Artical, 'a' | 'b'>;

type Eag3 = ReadonlyOptions<Artical, 'a' | 'b'>;

function aa(aa: Eag3) {
	// aa.
}

const obj: DeepReadOnly<Artical> = {
	a: 1,
	b: 'string',
	c: true,
	d: {
		e: false
	}
};

// obj.d.e = true;

export {};
