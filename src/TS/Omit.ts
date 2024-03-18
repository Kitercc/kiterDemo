import { Artical } from '.';

type Eg1 = Omit<Artical, 'title'>;

type NewOmit<T, K> = Pick<T, Exclude<keyof T, K>>;

type Eg2 = NewOmit<Artical, 'title'>;

type NewOmit1<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };

type Eg3 = NewOmit1<Artical, 'title' | 'content'>;
