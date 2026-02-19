'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AddDeleteWrapper from '../../../../components/addDeleteWrapper';
import DataView from '../../../../components/dataView';
import { useGlobal } from '@/app/GlobalState';
import { getList } from '@/lib/api_wrap/configAPI';

const BoardList = () => {
	const defaultScheme = useGlobal();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const params = useParams(); // Get URL parameters
	let slug;
	if (params) {
		slug = params.slug;
	} else {
		slug = defaultScheme.name;
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getList('TestBoard', slug);
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
	}, [slug, params, defaultScheme]);

	if (loading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка: {error.message}</p>;

	return (
		//
		<AddDeleteWrapper table="TestBoard" listOfAll={data}>
			<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
				Список плат:
			</h1>
			<DataView data={data} kind="TestBoard"></DataView>
		</AddDeleteWrapper>
	);
};

export default BoardList;
