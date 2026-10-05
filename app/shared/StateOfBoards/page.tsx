'use client';
import { useEffect, useState } from 'react';
import IndicatorsTable from '../../../components/forStatePages/indicatorsTable';
import { useGlobal } from '../../GlobalState';
import headerStyles from '@/styles/headerStyles.module.css';
import React from 'react';
import { getList } from '@/utils/api_wrap/configAPI';

const StateOfBoards = () => {
	const { currentWS, setPollingError } = useGlobal();
	const [data, setData] = useState([]);
	const [sul, setSul] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	useEffect(() => {
		const fetchBoards = async () => {
			const result = await getList('TestBoard', currentWS.name);
			setData(result);
		};
		const fetchSul = async () => {
			const result = await getList('Sul', currentWS.name);
			setSul(result);
		};
		const fetchAll = async () => {
			try {
				await fetchBoards();
				await fetchSul();
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err);
					setPollingError(err);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchAll();
	}, [currentWS, setPollingError]);

	if (loading) return <p className={headerStyles.warning}>Загрузка...</p>;
	if (error) return <p className={headerStyles.warning}>{error.message}</p>;
	return (
		//
		<div className="flex flex-col">
			<h1 className={headerStyles.sectionHeader}>
				Состояние тестовых плат рабочего пространства {currentWS.name}:
			</h1>
			<div className="w-full h-min">
				<IndicatorsTable data={data} board={true} sul={false}></IndicatorsTable>
			</div>
			<h1 className={headerStyles.sectionHeader}>
				Состояние СУЛ рабочего пространства {currentWS.name}:
			</h1>
			<div className="w-full h-min">
				<IndicatorsTable
					data={sul == null ? [] : sul}
					board={true}
					sul={true}
				></IndicatorsTable>
			</div>
		</div>
	);
};
export default StateOfBoards;
