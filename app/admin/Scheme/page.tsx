'use client';
import React, { useEffect, useState } from 'react';
import DataView from '../../../components/dataView';
import AddDeleteWrapper from '../../../components/addDeleteWrapper';
import { getList } from '@/lib/api_wrap/configAPI';
import { useGlobal } from '@/app/GlobalState';

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
	if (loading) return <p>Загрузка...</p>;
	if (pollingError) return <p>Ошибка: {pollingError.message}</p>;
	return (
		<AddDeleteWrapper table="Scheme">
			<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
				Список схем:
			</h1>
			<DataView data={data} kind="Scheme"></DataView>
		</AddDeleteWrapper>
	);
};

export default Schemelist;
