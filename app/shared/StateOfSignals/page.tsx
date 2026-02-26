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
				setGroups(conf.groups);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err);
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
		<div className="flex flex-row">
			{groups.map(group => (
				<div key={group.id} className="w-full h-min">
					<h1 className="text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
						Состояние сигналов группы {group.name}:
					</h1>
					<StateTable data={data[group.name]} group={group.name}></StateTable>
				</div>
			))}
		</div>
	);
};
export default StateOfSignals;
