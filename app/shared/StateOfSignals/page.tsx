'use client';

import React, { useEffect, useState } from 'react';
import StateTable from '@/components/forStatePages/signalTables';
import { useGlobal } from '@/app/GlobalState';
interface MyDataType {
	id: number;
	name: string;
}
interface DynamicRecord {
	[key: string]: [];
}

const StateOfSignals = () => {
	const { defaultScheme, pollingError, setPollingError } = useGlobal();
	const [data, setData] = useState<DynamicRecord>({});
	const [sulData, setSulData] = useState<DynamicRecord>({});
	const [groups, setGroups] = useState<[MyDataType] | []>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`/api/getSignalTables/${defaultScheme.name}?sortedSignals=true`
				);
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				const sulResponse = await fetch(
					`/api/getSulSignalTables/${defaultScheme.name}`
				);
				const sulConf = await sulResponse.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				const tempGroups = conf.groups;
				const tempData = conf.data;
				console.log('data', tempData, 'sul', sulConf, 'groups', tempGroups);
				if (sulConf.data != undefined) {
					const tempData2 = tempGroups.reduce(
						(acc: DynamicRecord, group: MyDataType) => {
							console.log('data w upd, in theory', {
								...acc,
								[group.name]: {
									...acc[group.name],
									sulSigs: sulConf.data[group.name],
								},
							});
							return {
								...acc,
								[group.name]: {
									...acc[group.name],
									sulSigs: sulConf.data[group.name],
								},
							};
						},
						tempData
					);
					console.log('aggregated data', tempData2);
					setData(tempData2);
				} else {
					setData(tempData);
				}
				setGroups(conf.groups);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(
						new Error(`Ошибка при загрузке данных с сервера: ${err.message}`)
					);
				}
			} finally {
			}
		};

		//fetchAll()
		fetchData();
		setLoading(false);
	}, [defaultScheme]);

	if (loading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка: {error.message}</p>;
	console.log('data', data);
	return (
		<div className="flex flex-col">
			{groups.map(group => (
				<div key={group.id} className="w-full h-min">
					<StateTable data={data[group.name]} group={group.name}></StateTable>
				</div>
			))}
		</div>
	);
};
export default StateOfSignals;
