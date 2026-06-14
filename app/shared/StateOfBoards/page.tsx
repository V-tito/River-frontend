'use client';
import { useEffect, useState } from 'react';
import IndicatorsTable from '../../../components/forStatePages/indicatorsTable';
import { useGlobal } from '../../GlobalState';
import headerStyles from '@/styles/headerStyles.module.css';
import React from 'react';
import { getList } from '@/utils/api_wrap/configAPI';
import { toggleScheme } from '@/utils/api_wrap/protocol';
import { useRouter, usePathname } from 'next/navigation';

const StateOfBoards = () => {
	const { defaultScheme, setPollingError } = useGlobal();
	const [data, setData] = useState([]);
	const [sul, setSul] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const router = useRouter();
	const pathname = usePathname();
	useEffect(() => {
		const handleRouteChange = async () => {
			await toggleScheme(defaultScheme.name, false);
			return;
		};
		window.addEventListener('beforeunload', handleRouteChange);

		return () => {
			window.removeEventListener('beforeunload', handleRouteChange);
		};
	}, [pathname]);
	useEffect(() => {
		const fetchBoards = async () => {
			const result = await getList('TestBoard', defaultScheme.name);
			console.log('list of boards from sp', result);
			setData(result);
		};
		const fetchSul = async () => {
			const result = await getList('Sul', defaultScheme.name);
			console.log('list of sul from sp', result);
			setSul(result);
		};
		const fetchAll = async () => {
			try {
				await toggleScheme(defaultScheme.name);
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
	}, [defaultScheme, setPollingError]);

	if (loading) return <p className={headerStyles.warning}>Загрузка...</p>;
	if (error) return <p className={headerStyles.warning}>{error.message}</p>;
	console.log('list of boards before sp render', data);
	return (
		//
		<div className="flex flex-col">
			<h1 className={headerStyles.sectionHeader}>
				Состояние тестовых плат рабочего пространства {defaultScheme.name}:
			</h1>
			<div className="w-full h-min">
				<IndicatorsTable data={data} board={true}></IndicatorsTable>
			</div>
			<h1 className={headerStyles.sectionHeader}>
				Состояние СУЛ рабочего пространства {defaultScheme.name}:
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
