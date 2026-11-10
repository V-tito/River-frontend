import React, { useEffect, useCallback, useRef } from 'react';
import { MinimalSignal } from '@/utils/interfaces/minimalSignal';
import { netError } from '@/utils/api_wrap/netError';
import {
	entryGen,
	CPentry,
	CPentryKeys,
	CPstyle,
	CP,
	blobp,
	Coordinates,
	EntryStyle,
	validateEntryStyle,
	validateCoordinates,
} from '@/utils/interfaces/CPtypes';
import { postCP, renameFile, deleteFile } from '@/utils/api_wrap/fileAPI';
import { baseMode } from './baseMode';
import { convertEntry, makeCPfromContents } from './helpers';
import { useCPStyleManager } from './useCPStyleManager';
export function editingMode(envName: string) {
	const {
		currentConfName,
		setCurrentConfName,
		CPs,
		setCPs,
		saveCurrentToSessionStorage,
		loadCurrentFromSessionStorage,
		getInitialCPs,
		updateCPContent,
		init,
		setInit,
	} = baseMode(envName, 'editor');
	//file-altering-related
	const savingRef = useRef(false);
	const currentBlobs = useRef([] as Array<blobp>);

	const newCount = useRef(0);

	//file-altering-related
	useEffect(() => {
		currentBlobs.current = Object.keys(CPs).map(elem => {
			return {
				name: elem,
				blob: makeCPBlob(elem),
				isSaved: CPs[elem]?.isSaved,
			} as blobp;
		});
	});
	useEffect(() => {
		const saver = setInterval(async () => {
			if (!savingRef.current) {
				savingRef.current = true;
				if (Array.isArray(currentBlobs.current)) {
					const saving = currentBlobs.current.map(async element => {
						if (!element.isSaved) {
							try {
								await postCP(envName, element.name, element.blob).then(res => {
									if (res.ok) updateCPSavedState(true, element.name);
								});
							} catch (err) {
								console.debug('caught err saving', err);
							}
						}
					});
					await Promise.all(saving);
				}
				savingRef.current = false;
			}
		}, 2000);
		return () => clearInterval(saver);
	}, []);
	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('pagehide', () => {
			if (!savingRef.current) {
				savingRef.current = true;
				//const dataToSend = new FormData();
				for (const { name, blob, isSaved } of currentBlobs.current)
					if (!isSaved) postCP(envName, name, blob);
			}
		});
	}, []);

	const initCPs = async () => {
		if (!init) {
			const newCPs = await getInitialCPs();
			setCPs(newCPs);
			setInit(true);
		}
		loadCurrentFromSessionStorage();
	};
	const getNewName = useCallback(() => {
		let name = 'new' + newCount.current;
		console.debug(name + '.json' in CPs, name, CPs);
		while (name + '.json' in CPs) {
			newCount.current = newCount.current + 1;
			name = 'new' + newCount.current;
		}
		return name;
	}, [CPs]);

	const addCP = (
		name: string | undefined,
		contents: Array<entryGen> = [],
		style: CPstyle | undefined = undefined
	) => {
		const newCP = makeCPfromContents(name ?? getNewName(), contents, style);
		setCPs(prev => {
			return {
				...prev,
				[newCP.name]: newCP,
			};
		});
		setCurrentConfName(newCP.name);
	};
	//file-altering-related
	const makeCPBlob = (confName: string) => {
		const blob = new Blob(
			[
				JSON.stringify({
					content: CPs[confName]?.content,
					style: CPs[confName]?.style,
				}),
			],
			{
				type: 'text/json',
			}
		);
		return blob;
	};

	const saveCP = async (confName: string | undefined = currentConfName) => {
		if (!confName) throw new Error('Несуществующая панель');
		const blob = makeCPBlob(confName);
		try {
			await postCP(envName, confName, blob).then(res => {
				if (!res.ok) throw netError(res);
			});
		} catch (err) {
			console.debug('error saving cp', err);
		}

		//window.location.reload();}
	};
	const deleteCP = async (name: string | undefined) => {
		if (name == undefined) throw new Error('Несуществующая панель');

		setCPs(prev => {
			const { [name]: _, ...res } = prev;
			return res;
		});
		currentBlobs.current = currentBlobs.current.filter(bl => bl.name != name);
		if (currentConfName == name) setCurrentConfName(undefined);
		saveCurrentToSessionStorage();
		await deleteFile('CPs', envName, name);
	};
	const renameCP = async (
		newName: string,
		oldName: string | undefined = currentConfName
	) => {
		console.debug('entered rename cp');
		if (oldName == undefined) throw new Error('Несуществующая панель');
		setCPs(prev => {
			console.debug('ol tabs', prev);
			const { [oldName]: contents, ...res } = prev;

			return {
				...res,
				[newName]: contents ?? makeCPfromContents(newName),
			};
		});
		setCurrentConfName(newName);
		try {
			await renameFile('CPs', envName, oldName, newName);
		} catch (err) {
			console.debug('err renaming', err);
		}
	};
	const updateCPSavedState = (
		updater: boolean,
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
				[confName]: {
					...tab,
					isSaved: updater,
				} as CP,
			};
		});
	};
	//entry-related
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
	const {
		updateCPWidth,
		updateCPBackground,
		updateCPHeight,
		updateCPStyle,
		formatEntryStyle,
	} = useCPStyleManager(currentConfName, setCPs, CPs);
	const alterEntryField = (
		index: number,
		field: string,
		val:
			| string
			| number
			| Coordinates
			| EntryStyle
			| ((
					prev: string | number | MinimalSignal | Coordinates | EntryStyle
			  ) => string | number | MinimalSignal | Coordinates | EntryStyle),
		confname: string | undefined = currentConfName
	) => {
		console.debug('entered alter entry field');
		if (confname) {
			console.debug('notnull confname in alter');
			if (CPs[confname]) {
				console.debug('have cp in alter');
				let entry = CPs[confname].content[index] ?? convertEntry({});
				const entryval = entry[field as keyof CPentry];
				if (CPentryKeys.has(field)) {
					console.debug('field is in keys');
					const newval = typeof val == 'function' ? val(entryval) : val;
					console.debug('newval in alter entry field', newval);
					entry = { ...entry, [field as keyof CPentry]: newval };
				} else if (['parentGroup', 'name'].includes(field)) {
					const newval =
						typeof val == 'function'
							? val(entry.signal[field as keyof MinimalSignal])
							: val;
					console.debug('newval in alter entry field', newval);
					entry = {
						...entry,
						signal: { ...entry.signal, [field as keyof MinimalSignal]: newval },
					};
				} else {
					const newval = formatEntryStyle(index, field, val, confname);
					if (newval)
						entry = {
							...entry,
							style: newval,
						};
				}
				console.debug('entry in alter entry field', entry);
				updateCPContent(prev => prev.toSpliced(index, 1, entry), confname);
			}
		}
	};

	return {
		currentConfName,
		setCurrentConfName,
		CPs,
		getNewName,
		addCP,
		saveCurrentToSessionStorage,
		deleteCP,
		updateCPContent,
		initCPs,
		renameCP,
		saveCP,
		insertEntry,
		removeEntry,
		alterEntryField,
		updateCPWidth,
		updateCPBackground,
		updateCPHeight,
		updateCPStyle,
	};
}
