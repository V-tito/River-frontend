import styles from './stateTable.module.css';
import StateIndicator from './stateIndicator';
import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../app/GlobalState';
import PropTypes from 'prop-types';
import { getBoardState, getSignalState } from '@/lib/api_wrap/protocol';
const IndicatorsTable = ({ data, board, group = null }) => {
	const [allStates, setAllStates] = useState({});
	const [responseWaiting, setResponseWaiting] = useState(false);
	const { setPollingError } = useGlobal();
	const [loading, setLoading] = useState(true);
	//const [checkConstantly, setCheck] = useState(true);
	useEffect(() => {
		const fetchCurrentState = async sig => {
			let result;
			let last = Date.now();
			console.log('fetching', sig.name, 'start', last);
			try {
				if (board) {
					result = getBoardState(sig.name);
				} else {
					result = getSignalState(group, sig.name);
				}
				console.log('fetching', sig.id, 'set api in', Date.now() - last);
				last = Date.now();
				console.log(
					'fetching',
					sig.name,
					'waiting for response in',
					Date.now() - last
				);
				last = Date.now();
				console.log(
					'fetching',
					sig.id,
					'waiting for result in',
					Date.now() - last
				);
				console.log('received:', result);
				setPollingError('ok');

				if (!board) {
					console.log(
						'with name',
						sig.name,
						'set state',
						result.value,
						'with last check time',
						String(result.freshness.split('.')[0]),
						'states',
						allStates
					);
					return [
						sig.name,
						{
							on: result.value,
							checked: String(result.freshness.split('.')[0]),
						},
					];
				} else {
					return [
						sig.name,
						{
							on: result,
						},
					];
				}
			} catch (err) {
				setPollingError(err);
				console.log(err);
				return [
					sig.name,
					{
						on: undefined,
						checked: null,
					},
				];
			}
		};
		const fetchAllStates = async () => {
			if (!responseWaiting) {
				const begin = Date.now();
				let last = begin;
				console.log('polling start', last);
				setResponseWaiting(true);
				console.log('before res', Date.now() - last);
				last = Date.now();
				const results = await Promise.all(
					data.map(item => fetchCurrentState(item))
				);
				console.log('after res', Date.now() - last);
				console.log(results);
				last = Date.now();
				setAllStates(prev => {
					const upd = { ...prev };
					results.forEach(data => {
						upd[data[0]] = data[1];
					});
					return upd;
				});
				console.log('time on mapping', Date.now() - last);
				setResponseWaiting(false);
				setLoading(false);
				console.log('polling end', Date.now());
				console.log('polling time', Date.now() - begin);
			}
		};
		fetchAllStates();
		console.log('first fetch on page w board=', board);
		//if (checkConstantly == true) {
		const intervalId = setInterval(fetchAllStates, 1000); // Fetch every second
		return () => clearInterval(intervalId);
		//}
	}, [board, setPollingError]);
	//const changeCheckSettings = () => {
	//	setCheck(prev => !prev);
	//};
	console.log('all states', allStates);
	if (loading) return <p>Загрузка...</p>;

	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th className={styles.th}>Имя</th>
					<th className={styles.th}>Состояние</th>
				</tr>
			</thead>
			<tbody>
				{data.length > 0 ? (
					data.map(item => (
						<tr key={item.id}>
							<td className={`${styles.td} ${styles.namer}`}>{item.name}</td>
							<td className={styles.td}>
								<SulSigIndicator
									on={allStates[item.name].on}
									turnedOnStatusName={item.turnedOnStatusName}
									turnedOffStatusName={item.turnedOnStatusName}
									lastCheckTime={allStates[item.name].checked}
									//todo change to proper naming
								></SulSigIndicator>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan="2" className={styles.td}>
							Данных нет
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};
IndicatorsTable.propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({})),
	board: PropTypes.bool,
	group: PropTypes.string,
};
export default IndicatorsTable;
