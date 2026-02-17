'use client';
import React, { useEffect, useState } from 'react';
import DataView from '../../../components/dataView';
import AddDeleteWrapper from '../../../components/addDeleteWrapper';
import { getList } from '@/lib/api_wrap/configAPI';

const Schemelist = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			console.log('try get list');
			try {
				const result = await getList('Scheme');
				setData(result);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	if (loading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка: {error.message}</p>;
	return (
		<AddDeleteWrapper table="Scheme" listOfAll={data}>
			<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
				Список схем:
			</h1>
			<DataView data={data} kind="Scheme"></DataView>
		</AddDeleteWrapper>
	);
};

export default Schemelist;
