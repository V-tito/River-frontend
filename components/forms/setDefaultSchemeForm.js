'use client';
import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../app/GlobalState';
import styles from './form.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import { getList } from '@/lib/api_wrap/configAPI';

const SetDefaultScheme = () => {
	const { defaultScheme, setDefaultScheme } = useGlobal();
	const [chosenScheme, setChosenScheme] = useState();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getList('Scheme');
				setData(result);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleChange = e => {
		const { value } = e.target;
		//console.log(e.target.value)
		console.log(value);
		setChosenScheme(data.find(record => record.id === Number(value)));
		console.log(value);
		console.log(data.find(record => record.id === Number(value)));
	};
	const handleSubmit = () => {
		console.log(chosenScheme);
		setDefaultScheme({
			id: chosenScheme.id,
			name: chosenScheme.name,
			comPort: chosenScheme.comPort,
		});
		console.log(defaultScheme);
	};

	if (error != null) return <p>Ошибка: {error.message}</p>;
	if (loading) return <p>Загрузка...</p>;
	console.log(`shemes ${data}`);

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className={`${styles.form} ${styles.non_modal_form}`}
			>
				<header className={headerStyles.modalHeader}>Установить схему</header>
				<div>
					<label>{'Выберите схему:'}</label>
					<select
						className={inputStyles.select}
						type="number"
						id="id"
						required
						onChange={handleChange}
					>
						<option value={null}>Выберите элемент...</option>
						{data.map(item => (
							<option key={item.id} value={item.id}>
								{item.name}
							</option>
						))}
					</select>
				</div>
				<div className={buttonStyles.buttons}>
					<button
						type="submit"
						className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
					>
						Установить
					</button>
				</div>
			</form>
			<p>
				Текущая схема:{' '}
				{defaultScheme == null ? 'не задана' : defaultScheme.name}
			</p>
		</div>
	);
};

export default SetDefaultScheme;
