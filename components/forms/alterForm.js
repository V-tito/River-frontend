'use client';
import React, { useEffect, useState } from 'react';
import styles from './form.module.css'; // Updated import path
import Modal from '../modals/inlineModal';
import { useGlobal } from '../../app/GlobalState';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { patchEntity } from '@/lib/api_wrap/configAPI';
import { patchHelper } from '@/lib/hooks/postPatchHelpers';
const AlterForm = ({ table, object }) => {
	const defaults =
		table != 'Signal'
			? { ...object }
			: {
					...object,
					parentGroup: object.parentGroup,
					testBoard: object.testBoard.name,
				};
	const { defaultScheme } = useGlobal();
	const { register, handleSubmit, reset, watch } = useForm({
		defaultValues: defaults,
	});
	console.log(defaults);
	const [config, setConfig] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [groupNames, setGroupNames] = useState([]);
	const [boardNames, setBoardNames] = useState([]);
	const [sul, setSul] = useState({});
	const nameAliases = {
		testBoard: boardNames,
		parentGroup: groupNames,
		parentSul: sul ? sul : [],
	};
	const watchers = Object.keys(defaults).reduce((acc, key) => {
		return { ...acc, [key]: watch(key) };
	}, {});
	console.log('watchers', watchers);

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
					console.log(`/api/getListsOfGroupsAndBoards/${defaultScheme.name}`);
					const response = await fetch(
						`/api/getAddConfig/getListsOfGroupsAndBoards/${defaultScheme.name}`
					);
					const data = await response.json();
					if (!response.ok) {
						throw new Error(`Ошибка сети ${response.status}`);
					}
					setBoardNames(Object.keys(data.boards));
					setGroupNames(Object.keys(data.groups));
					setSul(Object.keys(data.sul));
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
		try {
			await patchHelper(data, table, defaultScheme);
			window.location.reload();
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
	};
	if (loading) return <p>Загрузка формы...</p>;
	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
			<header className={styles.header}>Изменить элемент</header>
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
									checked={String(watchers[field.id]) == 'true'}
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
									checked={String(watchers[field.id]) == 'false'}
									{...register(field.id, field.validation)}
								/>{' '}
								{field.values[1]}
							</div>
						</div>
					) : field.type == 'select' ? (
						<select
							value={watchers[field.id]}
							className={styles.select}
							id={field.id}
							{...register(field.id, field.validation)}
						>
							<option>Выберите элемент...</option>
							{nameAliases[field.id].map(item => (
								<option className={styles.option} key={item} value={item}>
									{item}
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
							placeholder={object[field.id]}
							{...register(field.id, field.validation)}
						/>
					)}
				</div>
			))}
			<div className={styles.buttons}>
				<button type="submit" className={styles.button}>
					Отправить
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

AlterForm.propTypes = {
	table: PropTypes.string,
	object: PropTypes.shape({
		parentGroup: PropTypes.number,
		testBoard: PropTypes.shape({
			id: PropTypes.number,
		}),
	}),
};

export default AlterForm;
