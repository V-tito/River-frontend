import React, { useEffect, useState, useCallback } from 'react';
import { MinimalSignal } from '@/utils/interfaces/minimalSignal';
import { usePersistentData } from '@/utils/hooks/usePersistentData';
import { netError } from '@/utils/api_wrap/netError';
interface CPentry {
	signal: MinimalSignal;
	icon: string;
	type: string;
	id: string;
	default_: number;
}
type entryGen = Record<string, string | number | Record<string, string>>;
//todo: save logic, append/remove entry, edit entry field
//save logic: none for now, discuss at weekend
//docs
export function useCPManager(schemeName: string) {
	const [currentConfName, setCurrentConfName] = useState<string | undefined>();
	const [CPs, setCPs] = useState<Record<string, Array<CPentry>>>({});
	const [saved, setSaved] = useState(true);
	const { saveData, loadData, clearData } = usePersistentData({
		storageKey: 'CP-editor-contents',
		storageType: 'session',
	});
	const saveCPToSessionStorage = () => {
		saveData({
			current: currentConfName,
			contents: CPs,
		});
	};
	const loadCPFromSessionStorage = useCallback(() => {
		const data = loadData();
		if (data) {
			const { current, contents } = data;
			setCPs(contents);
			setCurrentConfName(current);
		}
	}, []);
	const convertEntry = (entry: entryGen) => {
		const defaults = {
			id: crypto.randomUUID(),
			signal: { parentGroup: '', name: '' },
			icon: 'trigger',
			type: 'setter',
			default_: 0,
		};
		const keys = new Set(['id', 'signal', 'icon', 'type', 'default_']);
		const entryKeys = new Set(Object.keys(entry));
		const forInit = keys.difference(entryKeys);
		let res = entry;
		for (const key of forInit)
			if (key in defaults) res[key] = defaults[key as keyof typeof defaults];
		return res as unknown as CPentry;
	};
	const addCP = (
		name: string = 'untitled' + Date.now() + '.json',
		contents: Array<entryGen> = []
	) => {
		console.debug('entered addcp');
		setCPs(prev => {
			return { ...prev, [name]: contents.map(convertEntry) as Array<CPentry> };
		});
		setCurrentConfName(name);
		saveCP();
	};
	const saveCP = async (confName: string | undefined = currentConfName) => {
		if (confName)
			try {
				const blob = new Blob([JSON.stringify(CPs[confName])], {
					type: 'text/json',
				});
				const dataToSend = new FormData();
				dataToSend.append('file', blob, confName);
				const response = await fetch(
					`/api/files/gen?folder=${schemeName}/CPs`,
					{
						method: 'POST',
						body: dataToSend,
					}
				);
				if (!response.ok) {
					throw netError(response);
				}
				//window.location.reload();
				setSaved(true);
			} catch (err) {
				if (err instanceof Error) {
					console.debug('error saving panel', err.message);
				}
			}
	};
	const deleteCP = async (name: string | undefined) => {
		if (name == undefined) throw new Error('Несуществующая панель');
		if (currentConfName == name) setCurrentConfName(undefined);
		setCPs(prev => {
			const { [name]: _, ...res } = prev;
			return res;
		});
		const response = await fetch(
			`/api/files/gen?folder=${schemeName}/CPs/&filename=${name}`,
			{
				method: 'DELETE',
			}
		);
		if (!response.ok) {
			throw netError(response);
		}
	};
	const renameCurrentCP = async (newName: string) => {
		console.debug('entered rename cp');
		if (currentConfName == undefined) throw new Error('Несуществующая вкладка');
		setCPs(prev => {
			console.debug('ol tabs', prev);
			const { [currentConfName]: contents, ...res } = prev;

			return {
				...res,
				[newName]: contents ?? [],
			};
		});
		setCurrentConfName(newName);
		try {
			const response = await fetch(
				`/api/files/rename?folder=${schemeName}/CPs&oldName=${currentConfName}&newName=${newName}`,
				{
					method: 'POST',
				}
			);
			if (!response.ok) {
				throw netError(response);
			}
		} catch (err) {
			console.debug('err renaming', err);
		}
	};
	const initCPs = async () => {
		console.debug('entered init tabs');
		//const data = loadData();
		//if (data) {
		//	console.debug('set from data');
		//	const { contents, current } = data;
		//	setCPs(contents);
		//	setCurrentConfName(current);
		//} else
		try {
			const response = await fetch(`/api/files/gen?folder=${schemeName}/CPs`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw netError(response);
			}
			const result = await response.json();
			const fileList = result.files;
			console.debug('flist', fileList);
			if (Array.isArray(fileList)) {
				console.debug('flist is array');
				fileList.forEach(async (file, index) => {
					const response = await fetch(
						`/api/files/gen?folder=${schemeName}/CPs&filename=${file}`,
						{
							method: 'GET',
						}
					);
					if (!response.ok) {
						throw netError(response);
					}
					const contentFile = await response.json();
					console.debug('contentFile in addTab', contentFile);
					if (contentFile.type != 'file') {
						throw new Error(`${file} не является файлом`);
					}
					const content = JSON.parse(contentFile.content);
					addCP(file, content);
				});
			}
		} catch (err) {
			console.debug('err initing', err);
		}
	};
	const updateCPContent = useCallback(
		(
			updater: Array<CPentry> | ((prev: Array<CPentry>) => Array<CPentry>),
			confName: string | undefined = currentConfName
		) => {
			console.debug('entered update cpc');
			if (!confName) return;
			console.debug('not null ccn');
			setCPs(prev => {
				const tab = prev[confName];
				if (tab == undefined) throw new Error('Несуществующая панель');
				return {
					...prev,
					[confName]: updater instanceof Function ? updater(tab) : updater,
				};
			});
			saveCP(confName);
		},
		[currentConfName]
	);
	const insertEntry = (
		index: number,
		entry: entryGen = {},
		confName: string | undefined = currentConfName
	) => {
		if (confName)
			updateCPContent(
				prev => prev.toSpliced(index, 0, convertEntry(entry)),
				confName
			);
	};
	const removeEntry = (
		index: number,
		confName: string | undefined = currentConfName
	) => {
		if (confName) updateCPContent(prev => prev.toSpliced(index, 1), confName);
	};
	const alterEntryField = (
		index: number,
		field: string,
		val:
			| string
			| number
			| ((
					prev: string | number | MinimalSignal
			  ) => string | number | MinimalSignal),
		confname: string | undefined = currentConfName
	) => {
		if (confname) {
			if (CPs[confname]) {
				let entry = CPs[confname][index] ?? convertEntry({});
				const entryval = entry[field as keyof CPentry];

				if (field in entry) {
					const newval = typeof val == 'function' ? val(entryval) : val;
					if (typeof newval == typeof entryval)
						entry = { ...entry, [field as keyof CPentry]: newval };
				} else if (['parentGroup', 'name'].includes(field)) {
					const newval =
						typeof val == 'function'
							? val(entry.signal[field as keyof MinimalSignal])
							: val;
					entry = {
						...entry,
						signal: { ...entry.signal, [field as keyof MinimalSignal]: newval },
					};
				}
				updateCPContent(prev => prev.toSpliced(index, 1, entry), confname);
			}
		}
	};
	return {
		currentConfName,
		setCurrentConfName,
		CPs,
		addCP,
		saveCPToSessionStorage,
		deleteCP,
		updateCPContent,
		initCPs,
		renameCurrentCP,
		insertEntry,
		removeEntry,
		alterEntryField,
		saveCP,
	};
}
