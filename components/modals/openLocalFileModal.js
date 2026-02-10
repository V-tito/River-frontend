'use client';
import Popup from 'reactjs-popup';
import Modal from './inlineModal';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './modal.module.css';

const OpenLocalFileModal = ({ uploadAction, uploadError = null }) => {
	const [file, setFile] = useState();
	const handleFileChange = e => {
		setFile(e.target.files[0]);
	};
	return (
		<Popup
			trigger={
				<button className={styles.menuButton}>Открыть локальный скрипт</button>
			}
			closeOnDocumentClick={false}
		>
			{close => (
				<div className={styles.container}>
					<button onClick={() => close()} className={styles.closeButton}>
						&times;
					</button>
					<input
						className={styles.fileInput}
						type="file"
						accept=".json,application/json"
						onChange={e => handleFileChange(e)}
					/>
					<button
						onClick={e => {
							uploadAction(e, file);
							close();
						}}
						className={styles.menuButton}
					>
						Загрузить
					</button>
					<Modal state={uploadError}>
						{uploadError ? uploadError.message : ''}
					</Modal>
				</div>
			)}
		</Popup>
	);
};

OpenLocalFileModal.propTypes = {
	uploadAction: PropTypes.func,
	uploadError: PropTypes.any,
};
export default OpenLocalFileModal;
