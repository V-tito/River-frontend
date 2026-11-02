import { CPstyle, CP } from '@/utils/interfaces/CPtypes';
export function useCPStylemanager(
	currentConfName: string | undefined,
	setCPs: React.Dispatch<React.SetStateAction<Record<string, CP>>>
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
}
//rules for style render from draggable elem:
/*const parentRect = parent.current
? parent.current?.getBoundingClientRect()
: null;
console.debug('parent in draggable elem', parent);
console.debug('parent bounds in draggable elem', parentRect);
let x = item?.position?.x,
y = item?.position?.y;
console.debug('in draggable elem, x', x, 'y', y);
if (parentRect) {
const { left, right, top, bottom, width, height } = parentRect;
console.debug(y && height, y < height, top < y, y < bottom);
console.debug(x && width, left < x && x < right, left < x, x < right);
y = y && height ? (y < height ? (y > 0 ? y : 0) : height) : '';
x = x && width ? (x < width ? (x > 0 ? x : 0) : '') : '';*/

//and these ones are from drag-n-drop:
/*const refsize = panelRef.current?.getBoundingClientRect();
console.debug(
    'refsize',
    refsize,
    'shape.current.boundingRectangle',
    shape.current.boundingRectangle
);
const pos = data.position
    ? {
            x: data.position.x + transform.x,
            y: data.position.y + transform.y,
        }
    : {
            x: shape.current.left - (refsize.left ?? 0),
            y: shape.current.top - (refsize.top ?? 0),
        };
if (refsize) {
    if (
        pos.x >
        refsize.right -
            refsize.left -
            shape.current.boundingRectangle.width
    )
        pos.x =
            refsize.right -
            refsize.left -
            shape.current.boundingRectangle.width;
    if (
        pos.y >
        refsize.bottom -
            refsize.top -
            shape.current.boundingRectangle.height
    )
        pos.y =
            refsize.bottom -
            refsize.top -
            shape.current.boundingRectangle.height;
    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;
}*/
