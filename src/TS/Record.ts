/**
 * @example
 * type Eg1 = {
 *   a: { key1: string; };
 *   b: { key1: string; };
 * }
 * @desc 就是遍历第一个参数'a' | 'b'的每个子类型，然后将值设置为第二参数
 */
type Eg1 = Record<'a' | 'b', { key1: string }>;

type NewRecord<K extends keyof any, T> = { [P in K]: T };

type Eg2 = NewRecord<'a' | 'b', { key1: string }>;
