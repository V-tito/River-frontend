import React, { useEffect, useState, useMemo } from 'react';
import styles from '../controlPanel.module.css';
import { getBackground } from '@/utils/api_wrap/fileAPI';
function StyledGrid({ noConf, style, envName }) {
	const [styl, setStyl] = useState({});
	const getback = useMemo(
		async backname => {
			let back;
			if (backname) {
				back = await getBackground(envName, backname);
			}
			return back ? 'url(' + back + ')' : null;
		},
		[backname, envName]
	);
	const resetDimensions = useMemo((w, h) => {
		return w && h
			? {
					width: w + 'px',
					height: h + 'px',
					backgroundSize: w + 'px ' + h + 'px',
				}
			: null;
	});
	const resetStyle = useMemo(
		async (width, height, background) => {
			const backUrl = await getback(background);
			const dims = resetDimensions(width, height);
			const temp =
				backUrl && dims
					? {
							...dims,
							backgroundImage: backUrl,
						}
					: {};
			setStyl(temp);
		},
		[width, height, background]
	);
	useEffect(() => {
		const { width, height, background } = style;
		resetStyle(width, height, background);
	}, [style]);
	useEffect(() => {
		if (noConf) setStyl({ background: null, width: 100, height: 100 });
	}, [noConf]);

	return (
		<div className={styles.grid} style={{ ...styl, position: 'relative' }}>
			{children}
		</div>
	);
}
export default StyledGrid;
