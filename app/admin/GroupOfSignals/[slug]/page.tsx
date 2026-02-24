'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AddDeleteWrapper from '@/components/addDeleteWrapper';
import DataView from '@/components/dataView';
import { useGlobal } from '@/app/GlobalState';
import { getList } from '@/lib/api_wrap/configAPI';
const GroupList = () => {
	const { defaultScheme, pollingError, setPollingError } = useGlobal();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const params = useParams(); // Get URL parameters
	let slug;
	if (params) {
		slug = params.slug;
	} else {
		slug = defaultScheme.name;
	}
	console.log('slug', slug);
	console.log(defaultScheme);
	useEffect(() => {
		const fetchData = async () => {
			setPollingError(null);
			try {
				const result = await getList('GroupOfSignals', slug);
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
	}, [slug, params, defaultScheme]);
	if (loading) return <p>Загрузка...</p>;
	if (pollingError) return <p>{pollingError.message}</p>;

	return (
		<AddDeleteWrapper table="GroupOfSignals">
			<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
				Список групп сигналов:
			</h1>
			<DataView data={data} kind="GroupOfSignals"></DataView>
		</AddDeleteWrapper>
	);
};

export default GroupList;
