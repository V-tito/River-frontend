import React, { useEffect, useState } from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';

export default function ChooseCP({ schemeName, setCurrentCP }) {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const response = await fetch(`/api/files?folder=${schemeName}/CPs`, {
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
				setLoading(false);
			} catch (err) {
				setError(err);
			}
		};
		if (schemeName !== undefined) {
			fetchFiles();
		}
	}, []);
	if (loading) return <p>Загрузка...</p>;
	if (error)
		return <p>{'message' in error ? error.message : 'Неизвестная ошибка'}</p>;
	return (
		<div>
			<select
				className={inputStyles.select}
				onChange={e => {
					console.debug('changed CP to', e.target.value);
					setCurrentCP(e.target.value);
				}}
			>
				<option value={null}>Выбрать панель</option>
				{files.map((file, index) => (
					<option key={index} value={file}>
						{file}
					</option>
				))}
			</select>
		</div>
	);
}
