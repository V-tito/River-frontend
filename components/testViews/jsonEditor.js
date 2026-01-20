'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../modals/inlineModal';
import PopupForm from '../modals/popupForm';
import styles from './jsonEditor.module.css'; // Updated import path

const JsonEditor = () => {
	const [formData, setFormData] = useState();
	const [filename, setFilename] = useState();
	const [current, setCurrent] = useState();
	const [results, setResults] = useState([]);
	const [presets, setPresets] = useState([]);
	const [presetsError, setPresetsError] = useState(null);
	const [readerError, setReaderError] = useState(null);
	const [error, setError] = useState(null);
	const [presetsSet, setPresetsSet] = useState(false);

	const handleEditorChange = e => {
		setFormData(e.target.value);
	};
	const handlePresetsChange = e => {
		setPresets(e.target.value);
	};
	const setUpPresets = async () => {
		if (presets) {
			const data = JSON.parse(presets);
			setPresetsError(null);
			try {
				data.map(item => {
					console.log('item', item);
					if (!validateSignal(item.signal))
						throw new Error('Несуществующий сигнал');
				});
				for (let i = 0; i < data.length; i++) {
					const entry = data[i];

					const response = await fetch(`/api/setupJsonPresets`, {
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
					console.log('preset', entry, 'executed: ', result);
				}
			} catch (err) {
				setPresetsError(err);
			}
		}
		if (!presetsError) setPresetsSet(true);
		console.log('preset error', presetsError, '; set: ', presetsSet);
	};

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
	const executePresets = async () => {
		console.log('preset trigger');
		try {
			setCurrent(JSON.stringify('Предустановка значений'));
			const response = await fetch(
				`${process.env.API_URL}/api/river/v1/protocol/executePresets`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
				}
			);
			if (!response.ok) {
				throw new Error(
					`Ошибка сети: ${response.status}. ${response.message}.`
				);
			} else {
				setResults(prevResults => [
					...prevResults,
					'Выполнена предустановка значений',
				]);
			}
		} catch (err) {
			setError(err);
		}
	};

	const executeScript = async () => {
		try {
			console.log(formData);
			console.log(JSON.parse(formData));
			const data = JSON.parse(formData);
			setCurrent(JSON.stringify('Проверка существования сигналов'));
			if (presets) await executePresets();
			data.map(item => {
				console.log('item', item);
				if (!validateSignal(item.signal))
					throw new Error('Несуществующий сигнал');
			});
			setResults([]);

			for (let i = 0; i < data.length; i++) {
				const entry = data[i];
				setCurrent(JSON.stringify(entry));
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
				Promise.all(results);
				setResults(prevResults => [...prevResults, result]);
				console.log('results after appending', result, ': ', results);
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
		console.log('results final: ', results, typeof results);
	};

	const saveAsJson = () => {
		// Convert data to JSON string with formatting
		const jsonString = JSON.stringify(formData, null, 2);
		// Create a blob from the JSON string
		const blob = new Blob([jsonString], { type: 'application/json' });
		// Create a download link
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		// Set link properties
		link.href = url;
		link.download = filename;
		// Trigger download
		document.body.appendChild(link);
		link.click();
		// Clean up
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleFileRead = (event, setter) => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = e => {
			try {
				const content = e.target.result;
				console.log(content);
				setter(content);
				setError(null);
			} catch (err) {
				setError(err);
				console.log('invalid json');
				setter(null);
			}
		};

		reader.onerror = () => {
			setReaderError(new Error('Failed to read file'));
		};

		reader.readAsText(file);
	};

	const handleFilenameChange = e => {
		setFilename(e.target.value);
		if (!filename.endsWith('.json')) setFilename(`${filename}.json`);
	};

	return (
		<div className={styles.main}>
			<div className={styles.edit}>
				<header className={styles.header}>Редактор команд: </header>
				<PopupForm buttonLabel={'Задать начальные значения'}>
					<textarea
						className={styles.editor}
						value={presets}
						onChange={handlePresetsChange}
						placeholder={`Введите список команд в формате JSON: 
        [{
            "signal": "Имя_сигнала",
            "targetValue": "true" / "false",
			//Следующие атрибуты нужно указывать, только если нужно задать импульсную последовательность:
			"pulseTime": "число",
			"period": "число" //0 если нужен однократный импульс
        },...]`}
					/>
					<button onClick={() => setUpPresets()} className={styles.button}>
						Задать
					</button>
					<Modal state={presetsError}>
						{presetsError ? presetsError.message : ''}
					</Modal>
					<Modal state={presetsSet}>
						{presetsSet ? 'Начальные значения установлены успешно' : ''}
					</Modal>
					<div className={styles.fileManager}>
						<PopupForm buttonLabel={'Открыть локальный скрипт'}>
							<input
								className={styles.button}
								type="file"
								accept=".json,application/json"
								onChange={e => handleFileRead(e, setPresets)}
							/>
							<Modal state={readerError}>
								{readerError ? readerError.message : ''}
							</Modal>
						</PopupForm>
						<PopupForm buttonLabel={'Скачать скрипт'}>
							<input
								className={styles.input}
								type="text"
								placeholder="Имя с расширением .json или без расширения"
								onChange={handleFilenameChange}
							/>
							{filename ? <p>Текущее имя: {filename}</p> : <></>}
							<button onClick={saveAsJson} className={styles.button}>
								Скачать скрипт как JSON
							</button>
						</PopupForm>
					</div>
				</PopupForm>
				<textarea
					className={styles.editor}
					value={formData}
					onChange={handleEditorChange}
					placeholder={`Введите список команд в формате JSON: 
        [{
            "action": "check" / "wait" / "set"/"setPulse",
            "signal": "Имя_сигнала",
            "targetValue": "true" / "false"
			//только если action - "setPulse":
			"pulseTime": целое число - время в миллисекундах,
			"period": целое число - время в миллисекундах //0 если нужен однократный импульс
        },...]`}
				/>
				<button
					onClick={() => executeScript(formData)}
					className={styles.button}
				>
					Выполнить
				</button>
				<Modal state={error}>{error ? error.message : ''}</Modal>
				<div className={styles.fileManager}>
					<PopupForm buttonLabel={'Открыть локальный скрипт'}>
						<input
							className={styles.button}
							type="file"
							accept=".json,application/json"
							onChange={e => handleFileRead(e, setFormData)}
						/>
						<Modal state={readerError}>
							{readerError ? readerError.message : ''}
						</Modal>
					</PopupForm>
					<PopupForm buttonLabel={'Скачать скрипт'}>
						<input
							className={styles.input}
							type="text"
							placeholder="Имя с расширением .json или без расширения"
							onChange={handleFilenameChange}
						/>
						{filename ? <p>Текущее имя: {filename}</p> : <></>}
						<button onClick={saveAsJson} className={styles.button}>
							Скачать скрипт как JSON
						</button>
					</PopupForm>
				</div>
			</div>
			<div className={styles.show}>
				<header className={styles.header}>Результат выполнения: </header>
				<p className={styles.input}>
					<b>Выполняется:</b> {current}
				</p>
				<div className={styles.editor}>
					{results.map((result, i) => (
						<p key={i}>{result}</p>
					))}
				</div>
			</div>
		</div>
	);
};
JsonEditor.propTypes = {
	scheme: PropTypes.shape({ id: PropTypes.number }),
};

export default JsonEditor;
