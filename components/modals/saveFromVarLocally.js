import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import styles from './modal.module.css';
import Modal from './inlineModal';
import PropTypes from 'prop-types';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';

import './popup.css';
const SaveFromVarLocally = ({
	formData,
	initName = null,
	label = 'Сохранить',
	xml = false,
}) => {
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
			console.log('blob', blob);
			// Create a download link
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			// Set link properties
			link.href = url;
			link.download = filename;
			// Trigger download
			document.body.appendChild(link);
			link.click();
			// Clean up
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
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
		<Popup
			trigger={
				<button
					className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
				>
					{label}
				</button>
			}
			closeOnDocumentClick={false}
		>
			{close => (
				<div className={styles.container}>
					<div className={buttonStyles.delGrid}>
						<p className={headerStyles.modalHeader}>
							{label ? label : buttonLabel}
						</p>
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
						className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
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
SaveFromVarLocally.propTypes = {
	initName: PropTypes.string,
	scheme: PropTypes.shape({ id: PropTypes.number }),
	formData: PropTypes.array,
};
export default SaveFromVarLocally;
