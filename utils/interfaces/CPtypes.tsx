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
export interface EntryStyle {
	icon: string;
	position: Coordinates;
	width: number;
	height: number;
}
export interface CPentry {
	signal: MinimalSignal;
	type: string;
	id: string;
	default_: number;
	style: EntryStyle;
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
export type entryGen = Record<
	string,
	string | number | Record<string, string | number | Record<string, number>>
>;
export const CPentryKeys = new Set([
	'id',
	'signal',
	'type',
	'default_',
	'style',
]);
export const EntryStyleKeys = new Set(['icon', 'position', 'width', 'height']);
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
		typeof (entry as CPentry).type === 'string' &&
		typeof (entry as CPentry).default_ === 'number' &&
		typeof (entry as CPentry)?.style?.icon === 'string'
	);
}
export function validateEntryStyle(entry: unknown): entry is EntryStyle {
	console.debug('validating CPentry', entry);
	return (
		typeof entry === 'object' &&
		entry !== null &&
		typeof (entry as EntryStyle).icon === 'string' &&
		typeof (entry as EntryStyle).width === 'number' &&
		typeof (entry as EntryStyle).height === 'number' &&
		validateCoordinates((entry as EntryStyle).position)
	);
}
export function validateCoordinates(entry: unknown): entry is Coordinates {
	return (
		typeof (entry as Coordinates).x == 'number' &&
		typeof (entry as Coordinates).y == 'number'
	);
}
export const CoordKeys = new Set(['x', 'y']);
