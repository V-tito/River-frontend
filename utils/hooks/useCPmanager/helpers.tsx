import {
	entryGen,
	CPentry,
	CPentryKeys,
	CPstyle,
} from '@/utils/interfaces/CPtypes';

export const convertEntry = (entry: entryGen) => {
	const defaults = {
		id: crypto.randomUUID(),
		signal: { parentGroup: '', name: '' },
		icon: 'trigger',
		type: 'setter',
		default_: 0,
		position: { x: '', y: '' },
	};

	const entryKeys = new Set(Object.keys(entry));
	const forInit = CPentryKeys.difference(entryKeys);
	let res = entry;
	for (const key of forInit)
		if (key in defaults) res[key] = defaults[key as keyof typeof defaults];
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
			return maxX > elem?.position?.x ? maxX : elem?.position?.x;
		}, 0) + 88;
	const minHeight =
		convertedContents.reduce((maxY, elem) => {
			return maxY > elem?.position?.y ? maxY : elem?.position?.y;
		}, 0) + 161;
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
