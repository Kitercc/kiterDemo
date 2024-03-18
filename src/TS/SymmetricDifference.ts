/**
 * 获取T和U中都不存在的的属性
 */

type SymmetricDifference<T, U> = Exclude<T | U, T & U>;

type Eag1 = SymmetricDifference<'1' | '2' | '3', '2' | '3' | '4'>;
