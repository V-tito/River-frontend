import {
	MinimalSignal,
	ValidateMinimalSignal,
} from '@/utils/interfaces/minimalSignal';
export interface Coordinates {
	x: number;
	y: number;
}
export interface CPstyle {
	width: number;
	height: number;
	background: string | null;
}
export interface CPentry {
	signal: MinimalSignal;
	icon: string;
	type: string;
	id: string;
	default_: number;
	position: Coordinates;
}
export interface ExtendedCPentry extends CPentry {
	valid: boolean;
}
export interface CP {
	name: string;
	content: Array<CPentry | ExtendedCPentry>;
	isSaved: boolean;
	style: CPstyle | undefined;
}
export interface blobp {
	name: string;
	blob: Blob;
	isSaved: boolean;
}
export type entryGen = Record<string, string | number | Record<string, string>>;
export const CPentryKeys = new Set([
	'id',
	'signal',
	'icon',
	'type',
	'default_',
	'position',
]);
export function isExtEntry(entry: CPentry): entry is ExtendedCPentry {
	return 'valid' in entry;
}
export function validateEntry(entry: unknown): entry is CPentry {
	console.debug('validating CPentry', entry);
	return (
		typeof entry === 'object' &&
		entry !== null &&
		ValidateMinimalSignal((entry as CPentry).signal) &&
		typeof (entry as CPentry).id === 'string' &&
		typeof (entry as CPentry).icon === 'string' &&
		typeof (entry as CPentry).type === 'string' &&
		typeof (entry as CPentry).default_ === 'number'
	);
}
