import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import styles from './modal.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import Modal from './inlineModal';
import PropTypes from 'prop-types';
const SaveFromEditorToServerModal = ({ formData, initName = null, scheme }) => {
	const [filename, setFilename] = useState(
		initName
			? initName
			: `test-${new Date().toLocaleString().replace(/\.|,| |:/g, '-')}`
	);
	const [error, setError] = useState(null);
	const saveToServer = async () => {
		try {
			const blob = new Blob([JSON.stringify(formData)], {
				type: 'text/json',
			});
			const dataToSend = new FormData();
			dataToSend.append('file', blob, filename);
			const response = await fetch(`/api/files?folder=${scheme}`, {
				method: 'POST',
				body: dataToSend,
			});
			if (!response.ok) {
				throw new Error(
					`Ошибка сети: ${response.status}. ${response.message ? response.message : ''}.`
				);
			}
			window.location.reload();
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
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
		<Popup
			trigger={
				<button
					className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
				>
					Сохранить
				</button>
			}
			closeOnDocumentClick={false}
		>
			{close => (
				<div className={styles.container}>
					<div className={buttonStyles.delGrid}>
						<span className={headerStyles.modalHeader}>Сохранить</span>
						<button
							onClick={() => close()}
							className={`${buttonStyles.button} ${buttonStyles.closeButton}`}
						>
							&times;
						</button>
					</div>
					<input
						className={inputStyles.input}
						type="text"
						placeholder="Имя с расширением .json или без расширения"
						onChange={handleFilenameChange}
					/>
					{filename ? <p>Текущее имя: {filename}</p> : <></>}
					<button
						onClick={() => {
							saveToServer();
							close();
						}}
						className={`${buttonStyles.button}  ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
					>
						Сохранить
					</button>
					<Modal state={error}>
						{error
							? error.message
								? error.message
								: 'Неизвестная ошибка'
							: 'Неизвестная ошибка'}
					</Modal>
				</div>
			)}
		</Popup>
	);
};
SaveFromEditorToServerModal.propTypes = {
	initName: PropTypes.string,
	scheme: PropTypes.shape({ id: PropTypes.number }),
	formData: PropTypes.array,
};
export default SaveFromEditorToServerModal;
