import React, { useEffect, useState, useCallback } from 'react';
import { usePersistentData } from '@/utils/hooks/usePersistentData';

import {
	entryGen,
	CPentry,
	CPentryKeys,
	CPstyle,
	CP,
} from '@/utils/interfaces/CPtypes';
import { getCP, getCPlist } from '@/utils/api_wrap/fileAPI';
import { makeCPfromContents } from './helpers';

export function baseMode(envName: string, mode: string) {
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
			fileList = await getCPlist(envName);
		} catch (err) {
			console.debug('err getting file list', err);
		}
		console.debug('flist', fileList);
		if (Array.isArray(fileList)) {
			console.debug('flist is array');
			const fileProms = fileList.map(async (file, index) => {
				try {
					const content = await getCP(envName, file.name);
					return [file.name, content];
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
							content?.content ?? content,
							content?.style
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
	};
}
