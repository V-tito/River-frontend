'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './editor.module.css';
import Modal from '../modals/inlineModal';
import PropTypes from 'prop-types';
import CommandBarEditor from './commandBars/commandBarEditor';
import FileManager from './fileManagerForEditor';
import ResultsViewWithHighlight from './resultsViewWithHighlight';
const Editor = ({ scheme }) => {
	const [formData, setFormData] = useState([]);
	const [current, setCurrent] = useState();
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isHovered, setIsHovered] = useState();
	const params = useSearchParams();
	console.log('params', params);
	const filename = params.get('filename');
	console.log();
	useEffect(() => {
		const fetchFile = async path => {
			console.log(path);
			try {
				const response = await fetch(`/api/files${path}`, {
					method: 'GET',
				});
				const additionalData = await response.json();
				console.log('addata', additionalData);
				if (additionalData.type != 'file') {
					throw new Error(`${path} не является файлом`);
				}
				setFormData(JSON.parse(additionalData.content));
			} catch (err) {
				setError(err);
			}
		};

		if (params.get('filename')) {
			fetchFile(
				`?folder=${params.get('folder') ? params.get('folder') : ''}&filename=${params.get('filename')}`
			);
		}
		setLoading(false);
	}, []);
	const validateSignal = async signame => {
		const params = new URLSearchParams({ name: signame });
		const response = await fetch(
			`${
				process.env.API_URL
			}/api/river/v1/configurator/Signal/exists?${params.toString()}`
		);
		const result = await response.text();
		if (result == 'true') return true;
		else return false;
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
			if (!validateSignal(entry.signal))
				throw new Error('Несуществующий сигнал');
			if (entry.action == 'include') {
				const response = await fetch(
					`/api/files?folder=${scheme}&filename=${entry.filename}`,
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
				const contents = JSON.parse(additionalData.content);
				for (let i = 0; i < contents.length; i++) {
					const content = contents[i];
					await executeEntry(content);
				}
			} else {
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
		}
	};
	const executeScript = async () => {
		try {
			setResults([]);
			for (let i = 0; i < formData.length; i++) {
				setCurrent(i);
				await executeEntry(formData[i], i);
			}
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
	return (
		<div className={styles.main}>
			<div className={styles.editorBar}>
				<header className={styles.header}>Редактор команд: </header>
				<CommandBarEditor
					formData={formData}
					setFormData={setFormData}
					isHovered={isHovered}
					setIsHovered={setIsHovered}
					current={current}
					error={error}
				></CommandBarEditor>

				<button
					onClick={() => executeScript(formData)}
					className={styles.button}
				>
					Выполнить
				</button>
				<Modal state={error}>{error ? error.message : ''}</Modal>
				<FileManager
					formData={formData}
					setFormData={setFormData}
					initName={filename}
					scheme={scheme}
				></FileManager>
			</div>

			<div className={styles.show}>
				<header className={styles.header}>Результат выполнения: </header>
				<ResultsViewWithHighlight
					results={results}
					isHovered={isHovered}
					setIsHovered={setIsHovered}
				></ResultsViewWithHighlight>
			</div>
		</div>
	);
};
Editor.propTypes = {
	scheme: PropTypes.string,
};
export default Editor;
