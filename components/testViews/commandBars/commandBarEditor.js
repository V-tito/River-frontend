'use client';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../modals/inlineModal';
import PopupForm from '../../modals/popupForm';
import styles from '../editor.module.css'; // Updated import path
import { useSearchParams } from 'next/navigation';
import FileChooser from '../../fileManagement/fileChooserForEditor';
import OpenLocalFileModal from '../../modals/openLocalFileModal';
import CommandBar from './commandBar';

const CommandBarEditor = ({ scheme }) => {
	const [formData, setFormData] = useState([]);
	const [filename, setFilename] = useState();
	const [current, setCurrent] = useState();
	const [results, setResults] = useState([]);
	const [readerError, setReaderError] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isHovered, setIsHovered] = useState();
	const params = useSearchParams();
	console.log('params', params);
	console.log(params.get('filename'));
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
					throw new Error(`${filename} не является файлом`);
				}
				setFormData(JSON.parse(additionalData.content));
			} catch (err) {
				setError(err);
			}
		};

		if (params.get('filename')) {
			setFilename(params.get('filename'));
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
				executeEntry(formData[i], i);
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
	const saveToServer = async () => {
		try {
			const blob = new Blob([formData], {
				type: 'text/json',
			});
			console.log('blob', blob);
			const dataToSend = new FormData();
			dataToSend.append('file', blob, filename);
			console.log('before', JSON.stringify(dataToSend));
			const response = await fetch(`/api/files?folder=${scheme}`, {
				method: 'POST',
				body: dataToSend,
			});
			console.log('after', JSON.stringify(formData));
			if (!response.ok) {
				throw new Error(
					`Ошибка сети: ${response.status}. ${response.message ? response.message : ''}.`
				);
			}
			window.location.reload();
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
	};
	const handleFileRead = (event, file) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = e => {
			try {
				const content = e.target.result;
				console.log(content);
				setFormData(JSON.parse(content));
				setError(null);
			} catch (err) {
				setError(err);
				console.log('invalid json');
				setFormData(null);
			}
		};
		reader.onerror = () => {
			setReaderError(new Error('Не удалось прочитать файл'));
		};
		reader.readAsText(file);
	};

	const handleFilenameChange = e => {
		if (e.target.value) {
			if (!e.target.value.endsWith('.json')) {
				setFilename(`${e.target.value}.json`);
			} else {
				setFilename(e.target.value);
			}
		}
	};
	if (loading) return <p>Загрузка...</p>;
	console.log('formdata', formData);
	return (
		<div className={styles.main}>
			<div className={styles.editorBar}>
				<header className={styles.header}>Редактор команд: </header>
				<div className={styles.edit}>
					{formData.length > 0
						? formData.map((item, i) => (
								<div
									key={i}
									onMouseEnter={() => {
										setIsHovered(i);
										console.log('hover', i);
									}}
									onMouseLeave={() => setIsHovered(null)}
								>
									<CommandBar
										script={formData}
										setScript={setFormData}
										index={i}
										current={current}
										error={error}
										key={i}
										isHovered={isHovered}
									></CommandBar>
								</div>
							))
						: ''}
					<button
						className={styles.button}
						onClick={() => {
							setFormData(prevFormData => [...prevFormData, { action: null }]);
						}}
					>
						Добавить
					</button>
				</div>
				<button
					onClick={() => executeScript(formData)}
					className={styles.button}
				>
					Выполнить
				</button>
				<Modal state={error}>{error ? error.message : ''}</Modal>
				<div className={styles.fileManager}>
					<OpenLocalFileModal
						uploadAction={handleFileRead}
						uploadError={readerError}
					></OpenLocalFileModal>
					<PopupForm buttonLabel={'Сохранить на сервере'}>
						<input
							className={styles.input}
							type="text"
							placeholder="Имя с расширением .json или без расширения"
							onChange={handleFilenameChange}
						/>
						{filename ? <p>Текущее имя: {filename}</p> : <></>}
						<button onClick={saveToServer} className={styles.button}>
							Сохранить на сервере
						</button>
					</PopupForm>
					<FileChooser folder={scheme}></FileChooser>
				</div>
			</div>
			<div className={styles.show}>
				<header className={styles.header}>Результат выполнения: </header>
				<div className={styles.editor}>
					{results.map((result, i) => (
						<p
							onMouseEnter={() => setIsHovered(i)}
							onMouseLeave={() => setIsHovered(null)}
							key={i}
							className={`${styles[result.actionType]}${isHovered == result.id ? styles.active : ''}`}
						>
							{result.timestamp} : {result.res}
						</p>
					))}
				</div>
			</div>
		</div>
	);
};
CommandBarEditor.propTypes = {
	initName: PropTypes.string,
	scheme: PropTypes.shape({ id: PropTypes.number }),
};

export default CommandBarEditor;
