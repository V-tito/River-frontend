import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
	MinimalSignal,
	ValidateMinimalSignal,
} from '@/utils/interfaces/minimalSignal';
import { usePersistentData } from '@/utils/hooks/usePersistentData';
import { netError } from '@/utils/api_wrap/netError';
import { checkExistence } from '@/utils/api_wrap/configAPI';
interface Coordinates {
	x: string;
	y: string;
}
interface CPstyle {
	width: string;
	height: string;
	background: string;
}
interface CPentry {
	signal: MinimalSignal;
	icon: string;
	type: string;
	id: string;
	default_: number;
	position: Coordinates;
}
interface CP {
	name: string;
	content: Array<CPentry>;
	isSaved: boolean;
	style: CPstyle | undefined;
}
interface blobp {
	name: string;
	blob: Blob;
	isSaved: boolean;
}
type entryGen = Record<string, string | number | Record<string, string>>;
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
const makeCPfromContents = (
	name: string,
	contents: Array<entryGen> = [],
	style: CPstyle | undefined = undefined
) => {
	console.debug('entered makecp');
	const newCP = {
		name: name,
		content: contents?.map(convertEntry) as Array<CPentry>,
		isSaved: true,
		style: style,
	};
	return newCP;
};
//todo docs
function baseMode(schemeName: string, mode: string) {
	const [currentConfName, setCurrentConfName] = useState<string | undefined>();
	const [CPs, setCPs] = useState<Record<string, CP>>({});
	const [init, setInit] = useState(false);
	const { saveData, loadData, clearData } = usePersistentData({
		storageKey: 'CP-' + mode + '-contents',
		storageType: 'session',
	});
	const saveCurrentToSessionStorage = () => {
		if (init)
			saveData({
				current: currentConfName,
			});
	};
	const loadCurrentFromSessionStorage = useCallback(() => {
		const data = loadData();
		if (data) {
			const { current } = data;
			setCurrentConfName(current);
		}
	}, []);
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			saveCurrentToSessionStorage();
		}, 500); // Debounce 500ms

		return () => clearTimeout(timeoutId);
	}, [currentConfName]);
	const updateCPContent = (
		updater: Array<CPentry> | ((prev: Array<CPentry>) => Array<CPentry>),
		confName: string | undefined = currentConfName
	) => {
		console.debug('entered update cpc');
		if (!confName) return;
		console.debug('not null ccn');
		setCPs(prev => {
			const tab = prev[confName]?.content;
			if (tab == undefined) throw new Error('Несуществующая панель');
			return {
				...prev,
				[confName]: {
					...prev[confName],
					content: updater instanceof Function ? updater(tab) : updater,
					isSaved: false,
				} as CP,
			};
		});
	};
	/**
	 * Инициализирует панели содержимым файлов из vault/[рабочее пространство]/CPs (проверяется, содержит ли файл валидный JSON
	 * нужного формата ({[name]: CP}), не проверяется расширение).
	 * @returns Record<string, CP>, сформированный из содержимого хранилища, который нужно затем передать в setCP,
	 * при необходимости пропустив через функцию постобработки
	 */
	const getInitialCPs = async () => {
		console.debug('entered init tabs');
		let fileList;
		try {
			const response = await fetch(`/api/files/gen?folder=${schemeName}/CPs`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw netError(response, 'при получении списка файлов');
			}
			const result = await response.json();
			fileList = result.files;
		} catch (err) {
			console.debug('err getting file list', err);
		}
		console.debug('flist', fileList);
		if (Array.isArray(fileList)) {
			console.debug('flist is array');
			const fileProms = fileList.map(async (file, index) => {
				try {
					const response = await fetch(
						`/api/files/gen?folder=${schemeName}/CPs&filename=${file}`,
						{
							method: 'GET',
						}
					);
					if (!response.ok) {
						throw netError(response, 'при чтении файла');
					}
					const contentFile = await response.json();
					console.debug('contentFile in addTab', contentFile);
					if (contentFile.type != 'file') {
						throw new Error(`${file} не является файлом`);
					}
					const content = JSON.parse(contentFile.content);
					return [file, content];
				} catch (err) {
					return [];
				}
			});
			const files = await Promise.all(fileProms);
			console.debug('files', files);
			const newCps = files.reduce((acc, item) => {
				if (item.length > 0) {
					const [file, content] = item;
					return {
						...acc,
						[file]: makeCPfromContents(
							file,
							content.content ?? content,
							content.style
						),
					};
				} else {
					return acc;
				}
			}, {});
			console.debug('new cps', newCps);
			return newCps as Record<string, CP>;
		} else {
			return {} as Record<string, CP>;
		}
	};
	const updateCPStyle = (
		attr: string,
		value: string,
		CPname: string | undefined = currentConfName
	) => {
		if (!CPname) return;
		setCPs(prev => {
			if (!prev[CPname]) return prev;
			return {
				...prev,
				[CPname]: {
					...prev[CPname],
					style: { ...prev[CPname].style, [attr]: value } as CPstyle,
				},
			};
		});
	};
	return {
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
		updateCPStyle,
	};
}
function testingMode(schemeName: string) {
	const {
		currentConfName,
		setCurrentConfName,
		CPs,
		setCPs,
		loadCurrentFromSessionStorage,
		getInitialCPs,
		init,
		setInit,
		updateCPStyle,
	} = baseMode(schemeName, 'tester');
	const initCPs = async () => {
		if (!init) {
			const newCPs = await getInitialCPs();
			try {
				for (const name of Object.keys(newCPs))
					if (newCPs[name]) {
						const content = newCPs[name].content;
						const sigsValidityPromise = content.map(async elem => {
							try {
								console.debug('checking validity with elem', elem);
								const valid = await checkExistence(
									'Signal',
									elem.signal.name,
									elem.signal.parentGroup,
									schemeName
								);

								return { ...elem, valid: valid };
							} catch (err) {
								return { ...elem, valid: false };
							}
						});
						const sigsValidity = await Promise.all(sigsValidityPromise);
						console.debug('validity map fetched', sigsValidity);
						newCPs[name].content = sigsValidity;
					}
			} catch (err) {
				console.debug(err);
			} finally {
				console.debug('settingCPs', newCPs);
				setCPs(newCPs);
				loadCurrentFromSessionStorage();
				setInit(true);
			}
		}
	};
	return { currentConfName, setCurrentConfName, CPs, initCPs, updateCPStyle };
}
function editingMode(schemeName: string) {
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
		updateCPStyle,
	} = baseMode(schemeName, 'editor');
	const savingRef = useRef(false);
	const currentBlobs = useRef([] as Array<blobp>);
	const newCount = useRef(0);
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
			console.debug('entered saver', savingRef.current);
			if (!savingRef.current) {
				console.debug("isn't saving");
				savingRef.current = true;
				console.debug('set saving ref true');
				console.debug('blobs', currentBlobs.current);
				if (Array.isArray(currentBlobs.current)) {
					const saving = currentBlobs.current.map(async element => {
						if (!element.isSaved) {
							console.debug('saving', element);
							try {
								await saveFile(element.name, element.blob).then(res => {
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
				console.debug('set saving ref false');
			}
		}, 2000);
		return () => clearInterval(saver);
	}, []);
	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('pagehide', () => {
			if (!savingRef.current) {
				savingRef.current = true;
				const dataToSend = new FormData();
				for (const { name, blob, isSaved } of currentBlobs.current)
					if (!isSaved) dataToSend.append('file', blob, name);
				const response = fetch(`/api/files/gen?folder=${schemeName}/CPs`, {
					method: 'POST',
					body: dataToSend,
					keepalive: true,
				});
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

	const addCP = (name: string | undefined, contents: Array<entryGen> = []) => {
		const newCP = makeCPfromContents(name ?? getNewName(), contents);
		setCPs(prev => {
			return {
				...prev,
				[newCP.name]: newCP,
			};
		});
		setCurrentConfName(newCP.name);
	};
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
	const saveFile = async (name: string, blob: Blob) => {
		const dataToSend = new FormData();
		dataToSend.append('file', blob, name);
		const response = await fetch(`/api/files/gen?folder=${schemeName}/CPs`, {
			method: 'POST',
			body: dataToSend,
			keepalive: true,
		});
		return response;
	};

	const saveCP = async (confName: string | undefined = currentConfName) => {
		if (!confName) throw new Error('Несуществующая панель');
		const blob = makeCPBlob(confName);
		try {
			await saveFile(confName, blob).then(res => {
				if (!res.ok) throw netError(res);
			});
		} catch (err) {
			console.debug('error saving cp', err);
		}

		//window.location.reload();}
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
			const response = await fetch(
				`/api/files/rename?folder=${schemeName}/CPs&oldName=${currentConfName}&newName=${newName}`,
				{
					method: 'POST',
					keepalive: true,
				}
			);
			if (!response.ok) {
				throw netError(response);
			}
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
			const tab = prev[confName]?.content;
			if (tab == undefined) throw new Error('Несуществующая панель');
			return {
				...prev,
				[confName]: {
					...prev[confName],
					isSaved: updater,
				} as CP,
			};
		});
	};
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
					prev: string | number | MinimalSignal | Coordinates
			  ) => string | number | MinimalSignal | Coordinates),
		confname: string | undefined = currentConfName
	) => {
		console.debug('entered alter entry field');
		if (confname) {
			console.debug('notnull confname in alter');
			if (CPs[confname]) {
				console.debug('have cp in alter');
				let entry = CPs[confname].content[index] ?? convertEntry({});
				const entryval = entry[field as keyof CPentry];
				if (field in entry) {
					const newval = typeof val == 'function' ? val(entryval) : val;
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
		insertEntry,
		removeEntry,
		alterEntryField,
		saveCP,
		updateCPStyle,
	};
}
export function validateEntry(entry: unknown): entry is CPentry {
	console.debug('validating CPentry', entry);
	return (
		typeof entry === 'object' &&
		entry !== null &&
		ValidateMinimalSignal((entry as CPentry).signal) &&
		typeof (entry as CPentry).id === 'string' &&
		typeof (entry as CPentry).icon === 'string' &&
		typeof (entry as CPentry).type === 'string' &&
		typeof (entry as CPentry).default_ === 'number'
	);
}
/**
 * Менеджер панелей управления. Возвращает таблицу панелей (react State), react State с именем текущей панели
 *  и набор функций для работы с панелями (отличается в разных режимах)
 * @param schemeName - имя рабочего пространства
 * @param mode - режим (editing или testing)
 * @returns
 */
export function useCPManager(schemeName: string, mode: string) {
	if (mode == 'editing') return editingMode(schemeName);
	else return testingMode(schemeName);
}
