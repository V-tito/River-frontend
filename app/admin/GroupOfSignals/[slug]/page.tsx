'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AddDeleteWrapper from '@/components/addDeleteWrapper';
import DataView from '@/components/dataView';
import { useGlobal } from '@/app/GlobalState';
import { getList } from '@/lib/api_wrap/configAPI';
const GroupList = () => {
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
console.log('slug',slug)
console.log(defaultScheme)
	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getList('GroupOfSignals', slug);
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
	if (error) return <p>{error.message}</p>;

	return (
		<AddDeleteWrapper table="GroupOfSignals" listOfAll={data}>
			<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
				Список групп сигналов:
			</h1>
			<DataView data={data} kind="GroupOfSignals"></DataView>
		</AddDeleteWrapper>
	);
};

export default GroupList;
