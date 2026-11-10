import {
	CPstyle,
	CP,
	Coordinates,
	EntryStyle,
	EntryStyleKeys,
	validateCoordinates,
	CoordKeys,
} from '@/utils/interfaces/CPtypes';
import { MinimalSignal } from '@/utils/interfaces/minimalSignal';

export function useCPStyleManager(
	currentConfName: string | undefined,
	setCPs: React.Dispatch<React.SetStateAction<Record<string, CP>>>,
	CPs: Record<string, CP>
) {
	const updateCPStyle = (
		attr: string,
		value: string | number,
		CPname: string | undefined = currentConfName
	) => {
		console.debug(
			'entered update cp style with attr',
			attr,
			'val',
			value,
			'cpname',
			CPname
		);
		if (!CPname) return;
		setCPs(prev => {
			if (!prev[CPname]) return prev;
			return {
				...prev,
				[CPname]: {
					...prev[CPname],
					style: { ...prev[CPname].style, [attr]: value } as CPstyle,
					isSaved: false,
				},
			};
		});
	};
	const updateCPWidth = (
		value: number,
		CPName: string | undefined = currentConfName
	) => {
		updateCPStyle('width', value, CPName);
	};
	const updateCPHeight = (
		value: number,
		CPName: string | undefined = currentConfName
	) => {
		updateCPStyle('height', value, CPName);
	};
	const updateCPBackground = (
		url: string,
		CPName: string | undefined = currentConfName
	) => {
		updateCPStyle('background', url, CPName);
	};
	const makeValidPosition = (
		index: number,
		pos: Coordinates,
		CPName: string | undefined = currentConfName
	) => {
		if (!CPName) return;
		const entrystyle = CPs?.[CPName]?.content?.[index]?.style;
		let x = pos?.x,
			y = pos?.y;
		const height = CPs?.[CPName]?.style?.height,
			width = CPs?.[CPName]?.style?.width,
			prevY = entrystyle?.position.y ?? 0,
			prevX = entrystyle?.position.x ?? 0;
		y = y && height ? (y < height && y > 0 ? y : prevY) : prevY;
		x = x && width ? (x < width && x > 0 ? x : prevX) : prevX;
		const newpos = { x, y } as Coordinates;
		return newpos;
	};
	const formatEntryStyle = (
		index: number,
		field: string,
		val:
			| string
			| number
			| Coordinates
			| EntryStyle
			| ((
					prev: string | number | Coordinates | EntryStyle | MinimalSignal
			  ) => string | number | Coordinates | EntryStyle | MinimalSignal),
		CPName: string | undefined = currentConfName
	) => {
		if (!CPName) return;
		console.debug('entered format entry style');
		let entry = CPs?.[CPName]?.content?.[index];
		let entrystyle = entry?.style;
		const entryval = entrystyle?.[field as keyof EntryStyle];
		let newval = null;
		if (field == 'position') {
			if (validateCoordinates(val))
				newval = val ? makeValidPosition(index, val, CPName) : null;
			else if (typeof val == 'function' && entryval != undefined) {
				const pos = val(entryval);
				if (validateCoordinates(pos))
					newval = makeValidPosition(index, pos, CPName);
			}
			if (newval)
				entrystyle = {
					...entrystyle,
					position: newval as Coordinates,
				} as EntryStyle;
		} else if (EntryStyleKeys.has(field)) {
			newval = typeof val == 'function' && entryval ? val(entryval) : val;
			entrystyle = {
				...entrystyle,
				[field as keyof EntryStyle]: newval,
			} as EntryStyle; //TODO more type guards
		} else if (CoordKeys.has(field)) {
			let pos,
				remaining,
				remname = field == 'x' ? 'y' : ('x' as keyof Coordinates);
			if (validateCoordinates(entryval)) {
				newval =
					typeof val == 'function'
						? val(entryval[field as keyof Coordinates])
						: typeof val == 'number'
							? val
							: null;
				remaining = entryval[remname];
			} else {
				((pos = typeof val == 'number' ? val : null), (remaining = 0));
			}
			if (pos) {
				newval = { [field]: pos, [remname]: remaining };
				if (validateCoordinates(newval))
					newval = makeValidPosition(index, newval, CPName);
			}
			if (newval)
				entrystyle = {
					...entrystyle,
					position: newval as Coordinates,
				} as EntryStyle;
		}
		console.debug('returning from format entry style', entrystyle);
		return entrystyle;
	};
	return {
		updateCPWidth,
		updateCPBackground,
		updateCPHeight,
		updateCPStyle,
		formatEntryStyle,
	};
}
