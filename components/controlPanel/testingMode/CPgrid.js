import React from 'react';
import CPset from './CPset';
import CPget from './CPget';
import styles from './controlPanel.module.css';
import { useGlobal } from '../../app/GlobalState';
import { fetchAllStates } from '../../../utils/hooks/getStateHelpers';

function CPgrid({ elems = [], schemeName = '' }) {
	const [setPollingError] = useGlobal();
	const [allStates, setAllStates] = useState({});
	const [responseWaiting, setResponseWaiting] = useState(false);
	useEffect(() => {
		fetchAllStates(
			schemeName,
			elems,
			setPollingError,
			responseWaiting,
			setResponseWaiting,
			setAllStates
		);
		const intervalId = setInterval(
			fetchAllStates,
			1000,
			schemeName,
			elems,
			setPollingError,
			responseWaiting,
			setResponseWaiting,
			setAllStates,
			setLoading
		);
		return () => clearInterval(intervalId);
	}, []);
	return (
		<div className={styles.grid}>
			{elems.map(elem =>
				elem.type == 'setter' ? (
					<CPset specs={elem} schemeName={schemeName}></CPset>
				) : (
					<CPget specs={elem} on={allStates}></CPget>
				)
			)}
		</div>
	);
}
export default CPgrid;
