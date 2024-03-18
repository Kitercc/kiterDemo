import { useReducer } from 'react';

export default function useUpdate() {
	const [_, update] = useReducer((number: number): number => number + 1, 0);

	return update;
}
