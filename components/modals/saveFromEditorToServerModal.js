import React, { useState } from 'react';
import PopupForm from './popupForm';
import styles from './modal.module.css';
import Modal from './inlineModal';
import PropTypes from 'prop-types';
const SaveFromEditorToServerModal = ({ formData, initName = null, scheme }) => {
	const [filename, setFilename] = useState(
		initName ? initName : `test-${new Date().toString()}`
	);
	const [error, setError] = useState(null);
	const saveToServer = async () => {
		console.log('fd passed to saver', formData);
		try {
			const blob = new Blob([JSON.stringify(formData)], {
				type: 'text/json',
			});
			console.log('blob', blob);
			const dataToSend = new FormData();
			dataToSend.append('file', blob, filename);
			console.log('before', JSON.stringify(dataToSend));
			const response = await fetch(`/api/files?folder=${scheme}`, {
				method: 'POST',
				body: dataToSend,
			});
			console.log('after', JSON.stringify(formData));
			if (!response.ok) {
				throw new Error(
					`Ошибка сети: ${response.status}. ${response.message ? response.message : ''}.`
				);
			}
			window.location.reload();
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
	};

	const handleFilenameChange = e => {
		if (e.target.value) {
			if (!e.target.value.endsWith('.json')) {
				setFilename(`${e.target.value}.json`);
			} else {
				setFilename(e.target.value);
			}
		}
	};

	return (
		<PopupForm buttonLabel={'Сохранить на сервере'}>
			<input
				className={styles.input}
				type="text"
				placeholder="Имя с расширением .json или без расширения"
				onChange={handleFilenameChange}
			/>
			{filename ? <p>Текущее имя: {filename}</p> : <></>}
			<button onClick={saveToServer} className={styles.menuButton}>
				Сохранить на сервере
			</button>
			<Modal state={error}>
				{error
					? error.message
						? error.message
						: 'Неизвестная ошибка'
					: 'Неизвестная ошибка'}
			</Modal>
		</PopupForm>
	);
};
SaveFromEditorToServerModal.propTypes = {
	initName: PropTypes.string,
	scheme: PropTypes.shape({ id: PropTypes.number }),
	formData: PropTypes.array,
};
export default SaveFromEditorToServerModal;
