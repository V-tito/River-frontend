'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './editor.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import Modal from '../modals/inlineModal';
import PropTypes from 'prop-types';
import SortableBarEditor from './commandBars/sortableBarEditor';
import ResultsViewWithHighlight from './resultsViewWithHighlight';
import { checkExistence } from '@/utils/api_wrap/configAPI';

//displays a pair of windows corresponding to a single test file - editor and results respectively.
//id is unique and is used to determine whether to display the component
//fpath isn't, so a few windows with the same file can be opened (don't want to fuck with it rn)
const EditAndResultsWindowPair = ({ scheme, id, fpath = null, currentId }) => {
	const [formData, setFormData] = useState([]); //content of editor
	const [currentCommand, setCurrentCommand] = useState(); //command being executed
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isHovered, setIsHovered] = useState();
	const [errorIDs, setErrorIDs] = useState([]);
	const { saveFormData, loadFormData } = usePersistentData({
		storageKey: id,
		storageType: 'session',
	});
	//save data on exit
	const router = useRouter();
	// Auto-save on change (with debounce)
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			saveFormData(formData);
		}, 500); // Debounce 500ms

		return () => clearTimeout(timeoutId);
	}, [formData, saveFormData]);
	// Save before page unload
	useBeforeUnload(() => {
		saveFormData(formData);
	}, true);
	useEffect(() => {
		const handleRouteChange = () => {
			saveFormData(formData);
		};
		// Using Next.js router events
		router.events?.on('routeChangeStart', handleRouteChange);
		return () => {
			router.events?.off('routeChangeStart', handleRouteChange);
		};
	}, [formData, router, saveFormData]);

	const fetchFile = async path => {
		const split = path.split('/');
		const folder = split.slice(0, split.length - 1);
		const file = split[split.length - 1];
		const response = await fetch(
			`/api/files?folder=${folder.join('/')}&filename=${file}`,
			{
				method: 'GET',
			}
		);
		const additionalData = await response.json();
		console.log('addata', additionalData);
		if (additionalData.type != 'file') {
			throw new Error(`${path} не является файлом`);
		}
		return JSON.parse(additionalData.content);
	};

	useEffect(async () => {
		let newFD = null;
		if (fpath != null) {
			try {
				newFD = await fetchFile(fpath);
			} catch (err) {
				setError(err);
			}
		} else {
			newFD = loadFormData();
		}
		if (newFD != null) setFormData(newFD);
		setLoading(false);
	}, []);

	const validateSignal = async (signame, group, subtype) => {
		const result = await checkExistence(subtype, signame, group, scheme.name);
		console.log('validate res', result);
		return result;
	};
	const executeEntry = async (entry, id = -1) => {
		const postCommands = [
			'preset',
			'presetPulse',
			'set',
			'setPulse',
			'executePresets',
		];
		let now;
		try {
			if (entry.action == 'include') {
				now = new Date();
				setResults(prevResults => [
					...prevResults,
					{
						res: `Подгружаем скрипт ${entry.script}`,
						timestamp: now.toLocaleTimeString(),
						actionType: 'include',
						id: id,
					},
				]);
				const response = await fetch(
					`/api/files?folder=${scheme.name}&filename=${entry.script}`,
					{
						method: 'GET',
						headers: { 'Content-Type': 'application/json' },
					}
				);
				if (!response.ok) {
					throw new Error(
						`Ошибка сети: ${response.status}. ${response.message ? response.message : ''}.`
					);
				}
				const additionalData = await response.json();
				if (additionalData.type != 'file') {
					throw new Error(`${entry.filename} не является файлом`);
				}
				setResults(prevResults => [
					...prevResults,
					{
						res: `Начинаем исполнение скрипта ${entry.script}`,
						timestamp: now.toLocaleTimeString(),
						actionType: 'include',
						id: id,
					},
				]);
				const contents = JSON.parse(additionalData.content);
				for (let i = 0; i < contents.length; i++) {
					const content = contents[i];
					await executeEntry(content, id);
				}
				setResults(prevResults => [
					...prevResults,
					{
						res: `Выполнен скрипт ${entry.script}`,
						timestamp: now.toLocaleTimeString(),
						actionType: 'include',
						id: id,
					},
				]);
			} else {
				entry.scheme = scheme.name;
				if ('signal' in entry) {
					const exists = validateSignal(entry.signal, entry.group, entry.sul);
					if (!exists) throw new Error('Несуществующий сигнал');
				}
				if (entry.action == 'wait') {
					now = new Date();
					setResults(prevResults => [
						...prevResults,
						{
							res: `Ждем, пока сигнал ${entry.signal} не станет ${entry.expectedValue ? 'активен' : 'неактивен'}`,
							timestamp: now.toLocaleTimeString(),
							actionType: postCommands.includes(entry.action)
								? 'setter'
								: 'checker',
							id: id,
						},
					]);
				}
				const response = await fetch(`/api/executeJsonTest`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(entry),
				});
				console.log('sent', entry);
				if (!response.ok) {
					console.log(JSON.stringify(entry));
					throw new Error(
						`Ошибка сети: ${response.status}. ${response.message}.`
					);
				}
				const result = await response.json();
				now = new Date();
				Promise.all(results);
				setResults(prevResults => [
					...prevResults,
					{
						res: result,
						timestamp: now.toLocaleTimeString(),
						actionType: postCommands.includes(entry.action)
							? 'setter'
							: 'checker',
						id: id,
					},
				]);
				console.log('results after appending', result, ': ', results);
			}
		} catch (err) {
			setError(err);
			setErrorIDs(errorIDs => [...errorIDs, id]);
			now = new Date();
			setResults(prevResults => [
				...prevResults,
				{
					res: `Ошибка: ${err.message}`,
					timestamp: now.toLocaleTimeString(),
					actionType: postCommands.includes(entry.action)
						? 'setter'
						: 'checker',
					id: id,
				},
			]);
		}
	};
	const executeScript = async () => {
		console.log('fd on exec', formData);
		try {
			setResults([]);
			setErrorIDs([]);
			for (let i = 0; i < formData.length; i++) {
				setCurrentCommand(i);
				await executeEntry(formData[i], i);
			}
			setCurrentCommand(formData.length);
		} catch (err) {
			if (err instanceof Error) {
				setError(err);

				console.log(`Error: ${err.message}`);
			}
		} finally {
			console.log('results final: ', results, typeof results);
		}
	};
	if (loading) return <p>Загрузка...</p>;
	console.log('formdata', formData);
	return id == currentId ? (
		<div className={styles.main}>
			<div className={styles.show}>
				<header className={headerStyles.modalHeader}>Редактор команд: </header>
				<SortableBarEditor
					formData={formData}
					setFormData={setFormData}
					isHovered={isHovered}
					setIsHovered={setIsHovered}
					current={currentCommand}
					errorIDs={errorIDs}
					setErrorIDs={setErrorIDs}
					setError={setError}
					schemeName={scheme.name}
				></SortableBarEditor>

				<button
					onClick={() => executeScript(formData)}
					className={`${buttonStyles.button} ${buttonStyles.menuButton}`}
				>
					Выполнить
				</button>
			</div>
			<div className={styles.show}>
				<header className={headerStyles.modalHeader}>
					Результат выполнения:{' '}
				</header>
				<ResultsViewWithHighlight
					results={results}
					isHovered={isHovered}
					setIsHovered={setIsHovered}
				></ResultsViewWithHighlight>
			</div>
		</div>
	) : (
		''
	);
};
Editor.propTypes = {
	scheme: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }),
};
export default Editor;
