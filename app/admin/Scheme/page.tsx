'use client';
import React, { useEffect, useState } from 'react';
import DataView from '../../../components/dataView';
import { getList } from '@/utils/api_wrap/configAPI';
import { useGlobal } from '@/app/GlobalState';
import headerStyles from '@/styles/headerStyles.module.css';

const Schemelist = () => {
	const { pollingError, setPollingError } = useGlobal();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setPollingError(null);
			console.log('try get list');
			try {
				const result = await getList('Scheme');
				setData(result);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setPollingError(err);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	if (loading) return <p className={headerStyles.warning}>Загрузка...</p>;
	if (pollingError)
		return (
			<p className={headerStyles.warning}>Ошибка: {pollingError.message}</p>
		);
	return (
		<div>
			<h1 className={headerStyles.sectionHeader}>
				Список рабочих пространств:
			</h1>
			<DataView
				data={data}
				kind="Scheme"
				label="рабочие пространства"
			></DataView>
		</div>
	);
};

export default Schemelist;
