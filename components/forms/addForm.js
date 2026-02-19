'use client';
import React, { useEffect, useState } from 'react';
import styles from './form.module.css'; // Updated import path
import Modal from '../modals/inlineModal';
import { useGlobal } from '../../app/GlobalState';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { postEntity } from '@/lib/api_wrap/configAPI';

const AddForm = ({ table }) => {
	const { defaultScheme } = useGlobal();
	const { register, handleSubmit, reset } = useForm();
	const [config, setConfig] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [groupToNames, setGroupToNames] = useState({});
	const [boardToNames, setBoardToNames] = useState({});
	const idToNameAliases = {
		testBoard: boardToNames,
		parentGroup: groupToNames,
	};

	useEffect(() => {
		const fetchConfig = async () => {
			const response = await fetch(`/api/getAddConfig/${table}`);
			const data = await response.json();
			setConfig(data);
		};
		fetchConfig();
		if (table == 'Signal') {
			const fetchGroupsAndBoards = async () => {
				try {
					const response = await fetch(
						`/api/getAddConfig/getListsOfGroupsAndBoards/${defaultScheme.name}`
					);

					const data = await response.json();
					if (!response.ok) {
						throw new Error(`Ошибка сети ${response.status}`);
					}
					setBoardToNames(data.boards);
					setGroupToNames(data.groups);
				} catch (err) {
					setError(err);
				}
			};
			fetchGroupsAndBoards();
			setLoading(false);
		} else {
			setLoading(false);
		}
	}, [table, defaultScheme]);

	const onSubmit = async data => {
		let newFormData = { ...data };
		if (
			['GroupOfSignals', 'TestBoard'].includes(table) &&
			!('signals' in data)
		) {
			newFormData = { ...newFormData, signals: [] };
			newFormData['parentScheme'] = {
				id: defaultScheme.id,
				name: defaultScheme.name,
			};
		}
		if ('parentGroup' in data) {
			newFormData['parentGroup'] = { id: data.parentGroup };
		}
		if ('testBoard' in data) {
			newFormData['testBoard'] = { id: data.testBoard };
		}

		try {
			await postEntity(table, newFormData);
			window.location.reload();
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
	};

	if (loading) return <p>Загружается форма...</p>;
	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
			<header className={styles.header}>Добавить элемент</header>
			{config.map(field => (
				<div key={field.id}>
					<label className={styles.label} htmlFor={field.id}>
						{field.label}{' '}
					</label>
					{field.type === 'radio' ? (
						<div className={styles.radio}>
							<div>
								<input
									type="radio"
									id={field.id}
									name={field.label}
									value="true"
									{...register(field.id, field.validation)}
								/>{' '}
								{field.values[0]}
							</div>
							<div>
								<input
									type="radio"
									id={field.id}
									name={field.label}
									value="false"
									{...register(field.id, field.validation)}
								/>{' '}
								{field.values[1]}
							</div>
						</div>
					) : field.type == 'select' ? (
						<select
							className={styles.select}
							id={field.id}
							{...register(field.id, field.validation)}
						>
							<option className={styles.option} value={null}>
								Выберите элемент...
							</option>
							{Object.entries(idToNameAliases[field.id]).map(item => (
								<option className={styles.option} key={item[0]} value={item[0]}>
									{item[1]}
								</option>
							))}
						</select>
					) : field.type == 'textarea' ? (
						<textarea
							id={field.id}
							className={styles.input}
							placeholder={field.placeholder}
							{...register(field.id, field.validation)}
						></textarea>
					) : (
						<input
							className={styles.input}
							type={field.type}
							id={field.id}
							placeholder={field.placeholder}
							{...register(field.id, field.validation)}
						/>
					)}
				</div>
			))}
			<div className={styles.buttons}>
				<button type="submit" className={styles.button}>
					Создать
				</button>
				<button type="reset" className={styles.button} onClick={() => reset()}>
					Очистить
				</button>
			</div>
			<div>
				<Modal state={error}>{error ? error.message : ''}</Modal>
			</div>
		</form>
	);
};

AddForm.propTypes = {
	table: PropTypes.string.isRequired,
};

export default AddForm;
