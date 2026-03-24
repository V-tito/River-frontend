import React, { useState } from 'react';
import styles from './modal.module.css';
import Popup from 'reactjs-popup';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import Modal from './inlineModal';
import './popup.css';

import PropTypes from 'prop-types';
const ConfirmDeleteModal = ({ state, buttonStyle }) => {
	const [error, setError] = useState(null);
	console.log('configured url', state);

	const onConfirm = async () => {
		try {
			console.log('configured url from onconfirm', state);
			const response = await fetch(state, {
				method: 'DELETE', //headers: {'Content-Type': 'application/json',}
			});

			if (!response.ok) {
				throw new Error(`Ошибка сети: ${response.status}`);
			}
			window.location.reload();
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
	};

	return (
		<Popup
			trigger={
				<button
					className={
						buttonStyle
							? buttonStyle
							: `${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`
					}
				>
					Удалить
				</button>
			}
		>
			{close => (
				<div className={styles.container}>
					<div className={headerStyles.modalHeader}>
						{' '}
						Подтверждение действия{' '}
					</div>
					<p className={styles.message}>Удалить файл?</p>
					<div className={buttonStyles.buttons}>
						<button
							onClick={onConfirm}
							className={`${buttonStyles.button} ${buttonStyles.menuButton}`}
						>
							Подтвердить
						</button>
						<button
							onClick={() => close()}
							className={`${buttonStyles.button} ${buttonStyles.deleteButton}`}
						>
							Отменить
						</button>
						<Modal state={error}>{error ? error.message : ''}</Modal>
					</div>
				</div>
			)}
		</Popup>
	);
};
ConfirmDeleteModal.propTypes = {
	state: PropTypes.string.isRequired,
	buttonStyle: PropTypes.string,
};

export default ConfirmDeleteModal;
