'use client';
import React, { useEffect, useState } from 'react';
import styles from './form.module.css'; // Updated import path
import Modal from '../modals/inlineModal';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { useGlobal } from '../../app/GlobalState';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { postHelper } from '@/utils/api_wrap/dataProcessingHelpers/postPatchHelpers';

const AddForm = ({ table, object = {} }) => {
	console.debug('prototype in add form', object);
	const { currentWS } = useGlobal();
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
		};
		fetchConfig();
		if ((table == 'Signal') | (table == 'SulSignal')) {
			const fetchGroupsAndBoards = async () => {
				try {
					const response = await fetch(
						`/api/getAddConfig/getListsOfGroupsAndBoards/${currentWS.name}`
					);

					const data = await response.json();
					if (!response.ok) {
						throw new Error(`Ошибка сети ${response.status}`);
					}
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
	}, [table, currentWS]);
	let defObj = object;
	if (table == 'Signal' || table == 'SulSignal') {
		const protogroup = object?.parentGroup?.name;
		const protoboard = object?.testBoard?.name;
		const protosul = object?.parentSul?.name;
		if (protogroup) defObj.parentGroup = protogroup;
		if (protoboard) defObj.testBoard = protoboard;
		else if (protosul) defObj.parentSul = protosul;
	}
	if (table == 'TestBoard') {
		defObj.maxInputs = defObj.maxInputs ?? 32;
		defObj.maxOutputs = defObj.maxOutputs ?? 24;
		defObj.protocolVersion = defObj.protocolVersion ?? 1;
	}
	console.debug('defObj', defObj);
	const defaults = defObj;
	if ('id' in defaults) delete defaults.id;
	console.debug('defaults in addform', defaults);
	const { register, handleSubmit, reset, resetDefaultValues, watch } = useForm({
		defaultValues: defaults,
	});
	const watchers = config.reduce((acc, field) => {
		return { ...acc, [field.id]: watch(field.id) };
	}, {});

	const onSubmit = async data => {
		setError(null);
		try {
			await postHelper(data, table, currentWS);
			window.location.reload();
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
			}
		}
	};
	useEffect(() => {
		if (object != {}) {
			const defObj =
				object != {}
					? table == 'Signal'
						? {
								...object,
								parentGroup: object.parentGroup
									? object.parentGroup.name
									: null,
								testBoard: object.testBoard ? object.testBoard.name : null,
							}
						: table == 'SulSignal'
							? {
									...object,
									parentGroup: object.parentGroup
										? object.parentGroup.name
										: null,
									parentSul: object.parentSul ? object.parentSul.name : null,
								}
							: object
					: null;
			resetDefaultValues(defObj);
		}
	}, [object]);
	if (loading) return <p>Загружается форма...</p>;
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
							<option className={inputStyles.option} value={''}>
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
