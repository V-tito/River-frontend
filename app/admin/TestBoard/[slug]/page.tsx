'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DataView from '../../../../components/dataView';
import { useGlobal } from '@/app/GlobalState';
import { getList } from '@/utils/api_wrap/configAPI';
import headerStyles from '@/styles/headerStyles.module.css';

const BoardList = () => {
	const { defaultScheme, pollingError, setPollingError } = useGlobal();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sul, setSul] = useState();
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
				if (Sul != null) setSul(Sul);
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
		<div>
			<h1 className={headerStyles.sectionHeader}>СУЛ:</h1>
			<DataView
				data={sul == null ? [] : [sul]}
				kind="Sul"
				label="СУЛ"
			></DataView>
			<h1 className={headerStyles.sectionHeader}>Список тестовых плат:</h1>
			<DataView data={data} kind="TestBoard" label="тестовые платы"></DataView>
		</div>
	);
};

export default BoardList;
