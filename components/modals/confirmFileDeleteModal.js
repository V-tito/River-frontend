import React, { useState } from 'react';
import styles from './modal.module.css';
import Popup from 'reactjs-popup';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import Modal from './inlineModal';
import './popup.css';
import { netError } from '@/utils/api_wrap/netError';
import { Trash } from '@deemlol/next-icons';
import PropTypes from 'prop-types';
import { deleteFile } from '@/utils/api_wrap/fileAPI';
const ConfirmDeleteModal = ({
	envName,
	fileCategory,
	className,
	fname,
	deleteFunc = null,
	afterDel = window.location.reload(),
}) => {
	const [error, setError] = useState(null);

	const onConfirm = async () => {
		try {
			if (deleteFunc) await deleteFunc();
			else await deleteFile(fileCategory, envName, fname);
		} catch (err) {
			setError(err);
			console.log(`Error: ${err.message}`);
		}
	};

	return (
		<Popup
			trigger={
				<button
					className={
						className
							? className
							: `${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`
					}
					title="Удалить"
				>
					<Trash />
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
							onClick={async () => {
								await onConfirm();
								if (error == null) {
									close();
									afterDel();
								}
							}}
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
					</div>
					<Modal state={error}>{error ? error.message : ''}</Modal>
				</div>
			)}
		</Popup>
	);
};

export default ConfirmDeleteModal;
