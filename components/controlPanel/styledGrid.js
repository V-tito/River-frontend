import React, { useEffect, useState } from 'react';
import styles from './controlPanel.module.css';
import { getBackground } from '@/utils/api_wrap/fileAPI';
function StyledGrid({ noConf, style, envName, children }) {
	const [back, setBack] = useState('');
	const [dims, setDims] = useState({});
	const resetback = async backname => {
		let back;
		if (backname) {
			back = await getBackground(envName, backname);
		}
		setBack(back ? 'url(' + back + ')' : '');
	};

	const resetDimensions = (w, h) => {
		setDims(
			w && h
				? {
						width: w + 'px',
						height: h + 'px',
						backgroundSize: w + 'px ' + h + 'px',
					}
				: {}
		);
	};
	useEffect(() => {
		resetback(style.background);
	}, [style.background]);
	useEffect(() => {
		resetDimensions(style.width, style.height);
	}, [style.width, style.height]);
	useEffect(() => {
		if (noConf) setStyl({ background: null, width: 100, height: 100 });
	}, [noConf]);

	return (
		<div
			className={styles.grid}
			style={{ ...dims, backgroundImage: back, position: 'relative' }}
		>
			{children}
		</div>
	);
}
export default StyledGrid;
