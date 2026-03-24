'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DataView from '@/components/dataView';
import { useGlobal } from '@/app/GlobalState';
import { getList } from '@/lib/api_wrap/configAPI';
import headerStyles from '@/styles/headerStyles.module.css';
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
	if (loading) return <p className={headerStyles.warning}>Загрузка...</p>;
	if (pollingError)
		return (
			<p className={headerStyles.warning}>Ошибка: {pollingError.message}</p>
		);

	return (
		<div>
			<h1 className={headerStyles.sectionHeader}>Список групп сигналов:</h1>
			<DataView
				data={data}
				kind="GroupOfSignals"
				label="группы сигналов"
			></DataView>
		</div>
	);
};

export default GroupList;
