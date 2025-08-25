import type { ResultKey } from '~/types'

export function resultKey(raw: string): ResultKey {
	const r = (raw || '').toString().trim().toUpperCase()
	const map: Record<string, ResultKey> = {
		W: 'wins',
		WIN: 'wins',
		WON: 'wins',

		D: 'draws',
		DRAW: 'draws',
		R: 'draws',

		L: 'losses',
		LOSS: 'losses',
		P: 'losses',
	}
	return map[r] ?? 'draws'
}

export function resultClass(key: ResultKey | string) {
	const k = (key || '').toString()
	return {
		'bg-green-500': k === 'wins',
		'bg-yellow-500': k === 'draws',
		'bg-red-500': k === 'losses',
	}
}
