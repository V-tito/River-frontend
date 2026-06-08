'use client';
import React, { useEffect, useState } from 'react';
import styles from './form.module.css'; // Updated import path
import Modal from '../modals/inlineModal';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { useGlobal } from '../../app/GlobalState';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { postHelper } from '@/utils/hooks/postPatchHelpers';

const AddForm = ({ table, object = {} }) => {
	const { defaultScheme } = useGlobal();
	console.log('schemeport', defaultScheme.comPort);
	const [config, setConfig] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [groupNames, setGroupNames] = useState([]);
	const [boardNames, setBoardNames] = useState([]);
	const [sul, setSul] = useState([]);
	const nameAliases = {
		testBoard: boardNames,
		parentGroup: groupNames,
		parentSul: sul ? sul : [],
	};

	useEffect(() => {
		const fetchConfig = async () => {
			const response = await fetch(`/api/getAddConfig/${table}`);
			const data = await response.json();
			setConfig(data);
			console.log(data);
		};
		fetchConfig();
		if ((table == 'Signal') | (table == 'SulSignal')) {
			const fetchGroupsAndBoards = async () => {
				try {
					const response = await fetch(
						`/api/getAddConfig/getListsOfGroupsAndBoards/${defaultScheme.name}`
					);

					const data = await response.json();
					if (!response.ok) {
						throw new Error(`Ошибка сети ${response.status}`);
					}
					console.log('groups and boards', data);
					console.log('groups', data.groups);
					console.log('groupnames', Object.keys(data.groups));
					console.log('sul', sul);
					setBoardNames(Object.keys(data.boards));
					setGroupNames(Object.keys(data.groups));
					setSul(data.sul ? Object.keys(data.sul) : []);
				} catch (err) {
					setError(err);
				} finally {
					setLoading(false);
				}
			};
			fetchGroupsAndBoards();
		} else {
			setLoading(false);
		}
	}, [table, defaultScheme]);

	const defaults =
		object != {}
			? table == 'Signal'
				? {
						...object,
						parentGroup: object.parentGroup ? object.parentGroup : null,
						testBoard: object.testBoard ? object.testBoard.name : null,
					}
				: object
			: table == 'TestBoard'
				? { maxInputs: 32, maxOutputs: 24, protocolVersion: 1 }
				: {};
	if ('id' in defaults) delete defaults.id;
	const { register, handleSubmit, reset, watch } = useForm({
		defaultValues: defaults,
	});
	const watchers = config.reduce((acc, field) => {
		return { ...acc, [field.id]: watch(field.id) };
	}, {});

	const onSubmit = async data => {
		setError(null);
		try {
			await postHelper(data, table, defaultScheme);
			window.location.reload();
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
	};

	if (loading) return <p>Загружается форма...</p>;
	console.log('groupNames', groupNames);
	console.log('sulName', sul);
	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
			{config.map(field => (
				<div key={field.id}>
					<label className={styles.label} htmlFor={field.id}>
						{field.label}{' '}
					</label>
					{field.type === 'radio' ? (
						<div className={inputStyles.radioBox}>
							<div>
								<input
									type="radio"
									id={field.id}
									name={field.label}
									className={inputStyles.radio}
									value="true"
									checked={String(watchers[field.id]) == 'true'}
									{...register(field.id, field.validation)}
								/>
								{field.values[0]}
							</div>
							<div>
								<input
									type="radio"
									id={field.id}
									className={inputStyles.radio}
									name={field.label}
									value="false"
									checked={String(watchers[field.id]) == 'false'}
									{...register(field.id, field.validation)}
								/>
								{field.values[1]}
							</div>
						</div>
					) : field.type == 'select' ? (
						<select
							className={inputStyles.select}
							id={field.id}
							{...register(field.id, field.validation)}
						>
							<option className={inputStyles.option} value={null}>
								Выберите элемент...
							</option>
							{nameAliases[field.id].map(item => (
								<option className={inputStyles.option} key={item} value={item}>
									{item}
								</option>
							))}
						</select>
					) : field.type == 'textarea' ? (
						<textarea
							id={field.id}
							className={inputStyles.input}
							placeholder={field.placeholder}
							{...register(field.id, field.validation)}
						></textarea>
					) : (
						<input
							className={inputStyles.input}
							type={field.type}
							id={field.id}
							placeholder={field.placeholder}
							{...register(field.id, field.validation)}
						/>
					)}
				</div>
			))}
			<div className={buttonStyles.buttons}>
				<button
					type="submit"
					className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
				>
					Создать
				</button>
				<button
					type="reset"
					className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
					onClick={() => reset()}
				>
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
	object: PropTypes.shape(),
};

export default AddForm;
