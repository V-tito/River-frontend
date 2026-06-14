import styles from './stateTable.module.css';
import StateIndicator from './stateIndicator';
import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../app/GlobalState';
import PropTypes from 'prop-types';
import { getBoardState, getSignalState } from '@/utils/api_wrap/protocol';
const IndicatorsTable = ({ data, board, sul = false, group = null }) => {
	const { defaultScheme, setPollingError } = useGlobal();
	const [allStates, setAllStates] = useState({});
	const [responseWaiting, setResponseWaiting] = useState(false);
	const [loading, setLoading] = useState(true);
	const newData = Array.isArray(data) ? data : [data];
	console.log('newdata', newData);
	useEffect(() => {
		const fetchCurrentState = async sig => {
			let result;
			let last = Date.now();
			console.log('fetching', sig.id, 'start', last);
			try {
				if (board) {
					result = await getBoardState(sig.name);
				} else {
					result = await getSignalState(defaultScheme.name, group, sig.name);
				}
				console.log('fetching', sig.id, 'set api in', Date.now() - last);
				last = Date.now();
				console.log(
					'fetching',
					sig.id,
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
				try {
					setResponseWaiting(true);
					console.log('start mapping on data', newData);
					const results = await Promise.all(
						newData.map(item => fetchCurrentState(item))
					);
					console.log('polling results', results);
					setAllStates(prev => {
						const upd = { ...prev };
						results.forEach(result => {
							upd[result[0]] = result[1];
						});
						return upd;
					});
				} catch (err) {
					setPollingError(err);
					setAllStates(
						newData.reduce((acc, item) => {
							return {
								...acc,
								[item.name]: {
									on: undefined,
									checked: null,
								},
							};
						}, {})
					);
				} finally {
					setResponseWaiting(false);
					setLoading(false);
				}
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
	console.log('data', data, Array.isArray(data));
	//console.log('all states', allStates);
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
				{newData.length > 0 ? (
					newData.map(item => (
						<tr key={item.id}>
							<td className={`${styles.td} ${styles.namer}`}>{item.name}</td>
							<td className={styles.td}>
								<StateIndicator
									on={allStates[item.name].on}
									turnedOnStatusName={
										!board
											? item.isStraight
												? item.turnedOnStatusName
												: item.turnedOffStatusName
											: sul
												? 'Есть соединение с СУЛ'
												: 'Есть соединение с платой'
									}
									turnedOffStatusName={
										!board
											? item.isStraight
												? item.turnedOffStatusName
												: item.turnedOnStatusName
											: sul
												? 'Нет соединения с СУЛ'
												: 'Нет соединения с платой'
									}
									lastCheckTime={allStates[item.name].checked}
								></StateIndicator>
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
