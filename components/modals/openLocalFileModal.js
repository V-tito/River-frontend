'use client';
import Popup from 'reactjs-popup';
import Modal from './inlineModal';
import React, { useState } from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import PropTypes from 'prop-types';
import styles from './modal.module.css';

const OpenLocalFileModal = ({
	uploadAction,
	uploadError = null,
	label = null,
	closeAfter = true,
	reloadOnClose = false,
	children,
}) => {
	const [file, setFile] = useState(null);
	const handleFileChange = e => {
		setFile(e.target.files[0]);
	};
	return (
		<Popup
			trigger={
				<button
					className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
				>
					{label ? label : 'Открыть локальный скрипт'}
				</button>
			}
			closeOnDocumentClick={false}
		>
			{close => (
				<div className={styles.container}>
					<div className={buttonStyles.delGrid}>
						<span className={headerStyles.modalHeader}>
							Открыть локальный скрипт
						</span>
						<button
							onClick={() =>
								reloadOnClose ? window.location.reload() : close()
							}
							className={`${buttonStyles.button} ${buttonStyles.closeButton}`}
						>
							&times;
						</button>
					</div>
					<input
						className={inputStyles.fileInput}
						type="file"
						accept=".json,application/json"
						onChange={e => handleFileChange(e)}
					/>
					<button
						onClick={e => {
							uploadAction(e, file);
							if (!uploadError & closeAfter) close();
						}}
						className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
						disabled={!file}
					>
						Загрузить
					</button>

					<Modal state={uploadError}>
						{uploadError ? uploadError.message : ''}
					</Modal>
					{children}
				</div>
			)}
		</Popup>
	);
};

OpenLocalFileModal.propTypes = {
	uploadAction: PropTypes.func,
	uploadError: PropTypes.any,
	label: PropTypes.string,
	children: PropTypes.node,
};
export default OpenLocalFileModal;
