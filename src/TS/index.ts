export interface Artical {
	title: string;
	content: string;
	author: string;
	date: Date;
	readCount: number;
}

export interface Demo {
	title: string;
	content: string;
	author?: string;
	date?: Date;
	readCount?: number;
}
