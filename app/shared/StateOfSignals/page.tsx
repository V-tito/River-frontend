'use client';

import React, { useEffect, useState } from 'react';
import StateTable from '@/components/forStatePages/signalTables';
import { useGlobal } from '@/app/GlobalState';
import headerStyles from '@/styles/headerStyles.module.css';
import { toggleScheme } from '@/utils/api_wrap/protocol';
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
				await toggleScheme(defaultScheme.name);
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
				if (sulConf.data != undefined) {
					const tempData2 = tempGroups.reduce(
						(acc: DynamicRecord, group: MyDataType) => {
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
					setData(tempData2);
				} else {
					setData(tempData);
				}
				setGroups(conf.groups);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err);
				}
			} finally {
				setLoading(false);
			}
		};

		//fetchAll()
		fetchData();
	}, [defaultScheme]);
	useEffect(() => {
		const toggleOff = async () => {
			await toggleScheme(defaultScheme.name, false);
		};
		const handleBeforeUnload = async (event: Event) => {
			await toggleOff();
			event.preventDefault();
			return;
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);
	if (loading) return <p className={headerStyles.warning}>Загрузка...</p>;
	if (error) return <p className={headerStyles.warning}>{error.message}</p>;
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
