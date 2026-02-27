'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AddDeleteWrapper from '../../../../components/addDeleteWrapper';
import DataView from '../../../../components/dataView';
import { useGlobal } from '@/app/GlobalState';
import { getList } from '@/lib/api_wrap/configAPI';

const BoardList = () => {
	const { defaultScheme, pollingError, setPollingError } = useGlobal();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sul, setSul] = useState({});
	const params = useParams(); // Get URL parameters
	let slug;
	if (params) {
		slug = params.slug;
	} else {
		slug = defaultScheme.name;
	}

	useEffect(() => {
		const fetchData = async () => {
			setPollingError(null);
			try {
				const result = await getList('TestBoard', slug);
				const Sul = await getList('Sul', slug);
				setData(result);
				setSul(Sul);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setPollingError(err);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [slug, params, defaultScheme]);

	if (loading) return <p>Загрузка...</p>;
	if (pollingError) return <p>Ошибка: {pollingError.message}</p>;

	return (
		//
		<AddDeleteWrapper table="TestBoard">
			<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
				СУЛ:
			</h1>
			<DataView data={[sul]} kind="Sul"></DataView>
			<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
				Список тестовых плат:
			</h1>
			<DataView data={data} kind="TestBoard"></DataView>
		</AddDeleteWrapper>
	);
};

export default BoardList;
