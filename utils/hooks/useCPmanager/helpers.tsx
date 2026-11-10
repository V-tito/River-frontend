import {
	entryGen,
	CPentry,
	CPentryKeys,
	CPstyle,
	validateCoordinates,
	Coordinates,
	defaultSide,
	EntryStyleKeys,
} from '@/utils/interfaces/CPtypes';

export const convertEntry = (entry: entryGen) => {
	const defaults = {
		id: crypto.randomUUID(),
		signal: { parentGroup: '', name: '' },

		type: 'setter',
		default_: 0,
		style: {
			icon: 'trigger',
			position: { x: 0, y: 0 },
			width: defaultSide,
			height: defaultSide,
		},
	};

	const entryKeys = new Set(Object.keys(entry));
	const forInit = CPentryKeys.difference(entryKeys);
	let res = entry;
	for (const key of forInit)
		if (key in defaults) res[key] = defaults[key as keyof typeof defaults];
	if (typeof res.style == 'object') {
		if (entry.style) {
			const styleKeys = new Set(Object.keys(entry.style));
			const forInit = EntryStyleKeys.difference(styleKeys);
			for (const key of forInit)
				if (key in defaults.style)
					res.style[key] = defaults.style[key as keyof typeof defaults.style];
		} else {
			if (typeof entry.icon == 'string') res.style.icon = entry.icon;
			if (
				typeof entry.position == 'object' &&
				validateCoordinates(entry.position)
			)
				res.style.position = entry.position as Record<string, number>;
		}
	}

	return res as unknown as CPentry;
};
export const makeCPfromContents = (
	name: string,
	contents: Array<entryGen> = [],
	style: CPstyle | undefined = undefined
) => {
	console.debug('entered makecp');
	const convertedContents = contents?.map(convertEntry);
	const minWidth =
		convertedContents.reduce((maxX, elem) => {
			return maxX > elem?.style?.position?.x ? maxX : elem?.style?.position?.x;
		}, 0) + defaultSide;
	const minHeight =
		convertedContents.reduce((maxY, elem) => {
			return maxY > elem?.style?.position?.y ? maxY : elem?.style?.position?.y;
		}, 0) + defaultSide;
	const height = style?.height
		? String(style?.height).match(/\D/g) == null &&
			Number(style?.height) > minHeight
			? Number(style?.height)
			: minHeight
		: minHeight;
	const width = style?.width
		? String(style?.width).match(/\D/g) == null &&
			Number(style?.width) > minWidth
			? Number(style?.width)
			: minWidth
		: minWidth;
	console.debug(
		'init cp width',
		String(style?.width).match(/\D/g)?.length == 0,
		String(style?.width).match(/\D/g),
		Number(style?.width),
		style?.width
	);
	const newStyle = style
		? {
				...style,
				height: height,
				width: width,
			}
		: { width: minWidth, height: minHeight, background: null };
	const newCP = {
		name: name,
		content: convertedContents as Array<CPentry>,
		isSaved: false,
		style: newStyle,
	};
	return newCP;
};
//todo docs
