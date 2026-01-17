'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../modals/inlineModal';
import styles from './jsonEditor.module.css'; // Updated import path

const JsonEditor = () => {
	const [formData, setFormData] = useState();
	const [filename, setFilename] = useState();
	const [results, setResults] = useState([]);
	const [error, setError] = useState(null);

	const handleChange = e => {
		setFormData(e.target.value);
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

	const executeScript = async () => {
		setResults([]);
		console.log(formData);
		console.log(JSON.parse(formData));
		const data = JSON.parse(formData);
		try {
			data.map(item => {
				console.log('item', item);
				if (!validateSignal(item.signal))
					throw new Error('Несуществующий сигнал');
			});
			for (let i = 0; i < data.length; i++) {
				const entry = data[i];

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
				setResults([...results, result]);
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
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

	const handleFileRead = event => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = e => {
			try {
				const content = e.target.result;
				console.log(content);
				setFormData(content);
				setError(null);
			} catch (err) {
				setError(err);
				console.log('invalid json');
				setFormData(null);
			}
		};

		reader.onerror = () => {
			setError(new Error('Failed to read file'));
		};

		reader.readAsText(file);
	};

	const handleFilenameChange = e => {
		setFilename(e.target.value);
		if (!filename.endsWith('.json')) setFilename(`${filename}.json`);
	};

	return (
		<div className={styles.main}>
			<header className={styles.header}>Редактор команд: </header>
			<textarea
				className={styles.editor}
				value={formData}
				onChange={handleChange}
				placeholder={`Введите список команд в формате JSON: 
        [{
            "action": "check" / "wait" / "set",
            "signal": "Имя_сигнала",
            "targetValue": "true" / "false"
        },...]`}
			/>
			<button onClick={() => executeScript(formData)} className={styles.button}>
				Выполнить
			</button>
			<Modal state={error}>{error ? error.message : ''}</Modal>

			<p>Загрузить файл с компьютера:</p>
			<input
				className={styles.button}
				type="file"
				accept=".json,application/json"
				onChange={handleFileRead}
			/>
			<div>
				<button onClick={saveAsJson} className={styles.button}>
					Скачать как JSON
				</button>
				<input
					className={styles.input}
					type="text"
					placeholder="Имя с расширением .json или без расширения"
					onChange={handleFilenameChange}
				/>
				{filename ? <p>Текущее имя: {filename}</p> : <></>}
			</div>
			<div>
				{results.map((result, i) => (
					<div key={i}>{JSON.stringify(result)}</div>
				))}
			</div>
		</div>
	);
};
JsonEditor.propTypes = {
	scheme: PropTypes.shape({ id: PropTypes.number }),
};

export default JsonEditor;
