import React, { useEffect, useState } from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { useGlobal } from '../../../app/GlobalState';
import { useForm } from 'react-hook-form';

export default function ChooseCP({ scheme, setCurrentCP }) {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const response = await fetch(`/api/files?folder=${scheme}/CPs`, {
					method: 'GET',
				});
				if (!response.ok) {
					throw new Error(
						`Ошибка сети ${response.status}: ${response.message ? response.message : ''}`
					);
				}
				const result = await response.json();
				const fileList = result.files;
				setFiles(fileList);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		if (scheme !== undefined) {
			fetchFiles();
		}
	}, []);
	if (loading) return <p>Загрузка...</p>;
	if (error)
		return <p>{'message' in error ? error.message : 'Неизвестная ошибка'}</p>;
	return (
		<form onSubmit={setCurrentCP}>
			<label className={inputStyles.label}>Выбрать панель управления</label>
			<select className={inputStyles.select}>
				{files.map((file, index) => (
					<option key={index}>{file}</option>
				))}
			</select>
			<button
				className={`${buttonStyles.button} ${buttonStyles.menuButton}`}
				type="submit"
			>
				Выбрать
			</button>
		</form>
	);
}
