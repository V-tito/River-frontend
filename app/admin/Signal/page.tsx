'use client';
//import //logger from "../..///logger";
import React, { useEffect, useState } from 'react';
import AddDeleteWrapper from '@/components/addDeleteWrapper';
import DataView from '@/components/dataView';
import { useGlobal } from '@/app/GlobalState';
import commonStyles from '@/components/common.module.css';

interface MyDataType {
	id: number;
	name: string;
}
interface DynamicRecord {
	[key: string]: [];
}
interface StateRecord {
	[key: string]: boolean;
}
const SignalList = () => {
	const { defaultScheme, pollingError, setPollingError } = useGlobal();
	const [data, setData] = useState<DynamicRecord>({});
	const [sulData, setSulData] = useState<DynamicRecord>({});
	const [groups, setGroups] = useState<[MyDataType] | []>([]);
	const [loading, setLoading] = useState(true);
	const [isOpen, setIsOpen] = useState<StateRecord>({});
	const [isSulOpen, setIsSulOpen] = useState<StateRecord>({});

	useEffect(() => {
		const fetchData = async () => {
			setPollingError(null);
			try {
				console.log('trying to fetch sigs');
				const response = await fetch(
					`/api/getSignalTables/${defaultScheme.name}`
				);
				console.log('end fetch sigs');
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				console.log('fetched sigs', conf.data);
				setData(conf.data);
				setGroups(conf.groups);
				setIsOpen(
					conf.groups.reduce((acc: Object, group: MyDataType) => {
						return { ...acc, [group.name]: false };
					}, {})
				);
				setIsSulOpen(
					conf.groups.reduce((acc: Object, group: MyDataType) => {
						return { ...acc, [group.name]: false };
					}, {})
				);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setPollingError(err);
				}
			}
		};
		const fetchSulData = async () => {
			try {
				console.log('trying to fetch sul sigs');
				const response = await fetch(
					`/api/getSulSignalTables/${defaultScheme.name}`
				);
				console.log('end fetch sul sigs');
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				console.log('fetched sul sigs', conf.data);
				setSulData(conf.data);
			} catch (err: unknown) {
				console.log('error fetch sul sigs');
				if (err instanceof Error) {
					setPollingError(err);
				}
			}
		};
		fetchData();
		fetchSulData();
		setLoading(false);
	}, [defaultScheme]);
	console.log('data', data);

	if (loading) return <p>Загрузка...</p>;
	return (
		<AddDeleteWrapper table="Signal">
			{groups.length > 0
				? groups.map(group => (
						<div key={group.id} className="w-full h-min">
							<div>
								<button
									onClick={() =>
										setIsOpen(prevIsOpen => ({
											...prevIsOpen,
											[group.name]: !prevIsOpen[group.name],
										}))
									}
									className={commonStyles.fold}
								>
									<div className="flex flex-row">
										<div
											className={`${commonStyles.triangle} transition-transform duration-300
            ${isOpen[group.name] ? 'rotate-360' : 'rotate-270'}`}
										/>
										<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
											Список сигналов группы {group.name}:
										</h1>
									</div>
								</button>
								{isOpen[group.name] ? (
									data[group.name] ? (
										<DataView data={data[group.name]} kind="Signal"></DataView>
									) : pollingError ? (
										pollingError.message
									) : (
										''
									)
								) : (
									''
								)}
							</div>

							<div>
								<button
									onClick={() =>
										setIsSulOpen(prevIsSulOpen => ({
											...prevIsSulOpen,
											[group.name]: !prevIsSulOpen[group.name],
										}))
									}
									className={commonStyles.fold}
								>
									<div className="flex flex-row">
										<div
											className={`${commonStyles.triangle} transition-transform duration-300
            ${isSulOpen[group.name] ? 'rotate-360' : 'rotate-270'}`}
										/>
										<h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
											Список сигналов СУЛ группы {group.name}:
										</h1>
									</div>
								</button>
								{isSulOpen[group.name] ? (
									sulData[group.name] ? (
										<DataView
											data={sulData[group.name]}
											kind="SulSignal"
										></DataView>
									) : pollingError ? (
										pollingError.message
									) : (
										''
									)
								) : (
									''
								)}
							</div>
						</div>
					))
				: ''}
		</AddDeleteWrapper>
	);
};

export default SignalList;
