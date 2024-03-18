import { Artical } from '.'

type NewPartial<T> = { [P in keyof T]?: T[P] }

type PartialOptions<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
// type PartialOptions<T, K extends keyof T> = { [P in K]?: T[P] };

type cc = Pick<Artical, 'author'>

type Eag1 = NewPartial<Artical>

type Eag2 = PartialOptions<Artical, 'title' | 'content'>

function aa(aa: Eag2) {}
