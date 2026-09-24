import React, { useState, useEffect, useRef } from 'react';
import CPset from './CPset';
import CPget from './CPget';
import styles from '../controlPanel.module.css';
import { useGlobal } from '@/app/GlobalState';
import { fetchAllStates } from '../../../utils/hooks/getStateHelpers';
import { Loader } from '@deemlol/next-icons';

function CPgrid({
	elems = [],
	schemeName = '',
	loadingConfig = true,
	setErrors,
}) {
	const { setPollingError } = useGlobal();
	const signals = elems
		.filter(elem => elem.type == 'getter')
		.map(elem => elem.signal);
	const [allStates, setAllStates] = useState({});
	const [responseWaiting, setResponseWaiting] = useState(false);

	useEffect(() => {
		console.debug('setting up fetch with sigs', signals);
		fetchAllStates(
			schemeName,
			signals,
			setPollingError,
			responseWaiting,
			setResponseWaiting,
			setAllStates
		);
		const intervalId = setInterval(
			fetchAllStates,
			500,
			schemeName,
			signals,
			setPollingError,
			responseWaiting,
			setResponseWaiting,
			setAllStates
		);
		return () => clearInterval(intervalId);
	}, [elems]);
	return (
		<div className={styles.grid}>
			{loadingConfig ? (
				<div className={styles.loader}>
					<Loader size={128} />
				</div>
			) : (
				elems.map((elem, index) =>
					elem.type == 'setter' ? (
						<CPset
							specs={elem}
							schemeName={schemeName}
							key={index}
							setErrors={setErrors}
						></CPset>
					) : (
						<CPget
							specs={elem}
							onTable={allStates}
							key={index}
							setErrors={setErrors}
						></CPget>
					)
				)
			)}
		</div>
	);
}
export default CPgrid;
