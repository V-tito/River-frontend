'use client';
//import //logger from "../..///logger";
import React, { useEffect, useState } from 'react';
import DataView from '@/components/dataView';
import { useGlobal } from '@/app/GlobalState';
import headerStyles from '@/styles/headerStyles.module.css';

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
				const response = await fetch(
					`/api/getSignalTables/${defaultScheme.name}`
				);
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
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
				const response = await fetch(
					`/api/getSulSignalTables/${defaultScheme.name}`
				);
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				setSulData(conf.data);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setPollingError(err);
				}
			}
		};
		fetchData();
		fetchSulData();
		setLoading(false);
	}, [defaultScheme]);

	if (loading) return <p className={headerStyles.warning}>Загрузка...</p>;
	return (
		<div>
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
									className={headerStyles.fold}
								>
									<div className="flex flex-row">
										<div
											className={`${headerStyles.triangle} transition-transform duration-300
            ${isOpen[group.name] ? 'rotate-360' : 'rotate-270'}`}
										/>
										<h1 className={headerStyles.sectionHeader}>
											Список сигналов группы {group.name}:
										</h1>
									</div>
								</button>
								{isOpen[group.name] ? (
									data[group.name] ? (
										<DataView
											data={data[group.name]}
											kind="Signal"
											label={`сигналы группы ${group.name}`}
										></DataView>
									) : pollingError ? (
										<p className={headerStyles.warning}>
											Ошибка: {pollingError.message}
										</p>
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
									className={headerStyles.fold}
								>
									<div className="flex flex-row">
										<div
											className={`${headerStyles.triangle} transition-transform duration-300
            ${isSulOpen[group.name] ? 'rotate-360' : 'rotate-270'}`}
										/>
										<h1 className={headerStyles.sectionHeader}>
											Список сигналов СУЛ группы {group.name}:
										</h1>
									</div>
								</button>
								{isSulOpen[group.name] ? (
									sulData[group.name] ? (
										<DataView
											data={sulData[group.name]}
											kind="SulSignal"
											label={`сигналы СУЛ группы ${group.name}`}
										></DataView>
									) : pollingError ? (
										<p className={headerStyles.warning}>
											Ошибка: {pollingError.message}
										</p>
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
		</div>
	);
};

export default SignalList;
