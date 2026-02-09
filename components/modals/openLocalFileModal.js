'use client';
import PopupForm from './popupForm';
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
		<PopupForm buttonLabel={'Открыть локальный скрипт'}>
			<input
				className={styles.button}
				type="file"
				accept=".json,application/json"
				onChange={e => handleFileChange(e)}
			/>
			<button onClick={e => uploadAction(e, file)} className={styles.button}>
				Загрузить
			</button>
			<Modal state={uploadError}>
				{uploadError ? uploadError.message : ''}
			</Modal>
		</PopupForm>
	);
};

OpenLocalFileModal.propTypes = {
	uploadAction: PropTypes.func,
	uploadError: PropTypes.any,
};
export default OpenLocalFileModal;
