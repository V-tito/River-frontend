'use client';
//import //logger from "../..///logger";
import React, { useEffect, useState } from 'react';
import AddDeleteWrapper from '../../../components/addDeleteWrapper';
import DataView from '../../../components/dataView';
import { useGlobal } from '../../GlobalState';
interface MyDataType {
	id: number;
	name: string;
	// Add other fields as necessary
}
interface DynamicRecord {
	[key: string]: []; // Change 'any' to a more specific type if possible
}
const SignalList = () => {
	const { defaultScheme } = useGlobal();
	const [data, setData] = useState<DynamicRecord>({});
	const [groups, setGroups] = useState<[MyDataType] | []>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [listForDel, setListForDel] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`/api/getSignalTables/${defaultScheme.id}`
				);
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				setData(conf.data);
				setGroups(conf.groups);
				setListForDel(conf.list);
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
	console.log('data', data);
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	return (
		<AddDeleteWrapper
			table="Signal"
			listOfAll={listForDel ?? [[{ id: null, name: 'none' }]]}
		>
			{groups.map(group => (
				<div key={group.id} className="w-full h-min">
					<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
						Список сигналов группы {group.name}:
					</h1>
					<DataView data={data[group.name]} kind="Signal"></DataView>
				</div>
			))}
		</AddDeleteWrapper>
	);
};

export default SignalList;
