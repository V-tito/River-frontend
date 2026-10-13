import React, { useState, useEffect, useRef } from 'react';
import CPset from './CPset';
import CPget from './CPget';
import CPload from './CPload';
import styles from '../controlPanel.module.css';
import { useGlobal } from '@/app/GlobalState';
import { fetchAllStates } from '../../../utils/api_wrap/dataProcessingHelpers/getStateHelpers';
import { Loader } from '@deemlol/next-icons';

function CPgrid({
	elems = [],
	currentGetterStates,
	schemeName = '',
	schemeOn,
}) {
	const [setterInit, setsetterInit] = useState({});
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		console.debug('loading', loading);
	}, [loading]);
	useEffect(() => {
		setLoading(true);
		console.debug('recalculating setter init tables with elems', elems);
		if (Array.isArray(elems)) {
			if (elems.length > 0) {
				console.debug('non-zero-length array of elems obtained');
				const validSetters = elems
					.filter((elem, index) => {
						return elem.valid && elem.type == 'setter';
					})
					.map(elem => elem.signal);
				console.debug('valid setters', validSetters);
				setsetterInit(
					validSetters.reduce((acc, sig) => {
						return { ...acc, [sig.name]: false };
					}, {})
				);
				setLoading(false);
			} else {
				setLoading(false);
			}
		} else {
			setLoading(false);
		}
	}, [elems]);
	if (loading) return <CPload />;
	return (
		<div className={styles.grid}>
			{elems.map((elem, index) =>
				elem.type == 'setter' ? (
					<CPset
						specs={elem}
						schemeName={schemeName}
						key={index}
						haveInit={setterInit}
						setHaveInit={setsetterInit}
						schemeOn={schemeOn}
					></CPset>
				) : (
					<CPget
						specs={elem}
						onTable={currentGetterStates}
						schemeOn={schemeOn}
						key={index}
					></CPget>
				)
			)}
		</div>
	);
}
export default CPgrid;
