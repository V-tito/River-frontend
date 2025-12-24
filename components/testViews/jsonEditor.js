'use client';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../modals/inlineModal';
import styles from './jsonEditor.module.css'; // Updated import path

const JsonEditor = ({ scheme }) => {
	const [formData, setFormData] = useState();
	const [signals, setSignals] = useState();
	const [results, setResults] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/api/getSignalTables/${scheme.id}`);
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				const newList = conf.list.reduce((acc, item) => {
					console.log('formatting signals', item);
					if (item instanceof Array) {
						console.log('concat', acc.concat(item));
						acc = acc.concat(item);
					} else acc.push(item);
					return acc;
				}, []);
				console.log('res', newList);
				setSignals(newList);
			} catch (err) {
				if (err instanceof Error) {
					setError(err);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [scheme]);

	const handleChange = e => {
		setFormData(e.target.value);
	};

	const executeScript = async () => {
		setResults([]);
		console.log(formData);
		console.log(signals);
		try {
			const data = JSON.parse(formData).reduce((acc, item) => {
				console.log('item', item);
				signals.map(sig => {
					console.log('sig', sig);
					console.log('signame', sig.name);
					console.log(sig.name == item.signal);
				});
				const sig = signals.find(signal => signal.name == item.signal);
				console.log(sig);
				if (sig != null)
					acc.push({
						...item,
						signal: sig.id,
					});
				else throw new Error('Несуществующий сигнал');
				return acc;
			}, []);
			console.log('data', data);
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
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
	};
	if (loading) return <div>Загрузка...</div>;
	return (
		<div className={styles.main}>
			<header className={styles.header}>Редактор команд: </header>
			<textarea
				className={styles.input}
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
