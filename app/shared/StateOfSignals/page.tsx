'use client';

import React, { useEffect, useState } from 'react';
import StateTable from '@/components/forStatePages/stateTable';
import { useGlobal } from '@/app/GlobalState';
interface MyDataType {
	id: number;
	name: string;
}
interface DynamicRecord {
	[key: string]: [];
}

const StateOfSignals = () => {
	const { defaultScheme } = useGlobal();
	const [data, setData] = useState<DynamicRecord>({});
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
				setData(conf.data);
				setGroups(conf.groups);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [defaultScheme]);

	if (loading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка: {error.message}</p>;

	return (
		<div className="flex flex-row">
			{groups.map(group => (
				<div key={group.id} className="w-full h-min">
					<h1 className="text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
						Состояние сигналов группы {group.name}:
					</h1>
					<StateTable data={data[group.name]}></StateTable>
				</div>
			))}
		</div>
	);
};
export default StateOfSignals;
