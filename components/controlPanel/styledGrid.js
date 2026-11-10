import React, { useEffect, useState } from 'react';
import styles from './controlPanel.module.css';
import { getBackground } from '@/utils/api_wrap/fileAPI';
function StyledGrid({ noConf, style, envName, children }) {
	const [styl, setStyl] = useState({});
	const getback = async backname => {
		let back;
		if (backname) {
			back = await getBackground(envName, backname);
		}
		return back ? 'url(' + back + ')' : null;
	};

	const resetDimensions = (w, h) => {
		return w && h
			? {
					width: w + 'px',
					height: h + 'px',
					backgroundSize: w + 'px ' + h + 'px',
				}
			: null;
	};
	const resetStyle = async (width, height, background) => {
		const backUrl = await getback(background);
		const dims = resetDimensions(width, height);
		let temp = dims ?? {};
		if (backUrl) temp = { ...temp, backgroundImage: backUrl };
		setStyl(temp);
	};

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
