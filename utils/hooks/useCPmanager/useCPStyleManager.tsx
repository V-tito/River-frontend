import {
	entryGen,
	CPentry,
	CPentryKeys,
	CPstyle,
	CP,
	isExtEntry,
	blobp,
	Coordinates,
} from '@/utils/interfaces/CPtypes';
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
