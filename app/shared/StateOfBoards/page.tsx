'use client';
import { useEffect, useState } from 'react';
import IndicatorsTable from '../../../components/forStatePages/indicatorsTable';
import { useGlobal } from '../../GlobalState';
import headerStyles from '@/styles/headerStyles.module.css';
import React from 'react';
import { getList } from '@/utils/api_wrap/configAPI';

const StateOfBoards = () => {
	const { defaultScheme, setPollingError } = useGlobal();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchBoards = async () => {
			try {
				const result = await getList('TestBoard', defaultScheme.name);
				console.log('list of boards from sp', result);
				setData(result);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err);
					setPollingError(err);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchBoards();
	}, [defaultScheme, setPollingError]);
	if (loading) return <p className={headerStyles.warning}>Загрузка...</p>;
	if (error) return <p className={headerStyles.warning}>{error.message}</p>;
	console.log('list of boards before sp render', data);
	return (
		//
		<div className="w-full">
			<h1 className={headerStyles.sectionHeader}>
				Состояние тестовых плат схемы {defaultScheme.name}:
			</h1>
			<IndicatorsTable data={data} board={true}></IndicatorsTable>
		</div>
	);
};
export default StateOfBoards;
