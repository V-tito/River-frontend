import React, { useState } from 'react';
import SaveFromEditorToServerModal from '../modals/saveFromEditorToServerModal';
import OpenLocalFileModal from '../modals/openLocalFileModal';
import FileChooser from '../fileManagement/fileChooserForEditor';
import styles from './editor.module.css';
import PropTypes from 'prop-types';
const FileManager = ({ formData, setFormData, initName, scheme }) => {
	const [readerError, setReaderError] = useState(null);
	const handleFileRead = (event, file) => {
		if (!file) return;

		const reader = new FileReader();

		reader.onload = e => {
			try {
				const content = e.target.result;
				console.log(content);
				setFormData(JSON.parse(content));
				setReaderError(null);
			} catch (err) {
				setReaderError(err);
				console.log('invalid json');
				setFormData(null);
			}
		};

		reader.onerror = () => {
			setReaderError(new Error('Не удалось прочитать файл'));
		};

		reader.readAsText(file);
	};
	return (
		<div className={styles.fileManager}>
			<OpenLocalFileModal
				uploadAction={handleFileRead}
				uploadError={readerError}
			></OpenLocalFileModal>
			<SaveFromEditorToServerModal
				formData={formData}
				initName={initName}
				scheme={scheme}
			></SaveFromEditorToServerModal>
			<FileChooser folder={scheme}></FileChooser>
		</div>
	);
};
FileManager.propTypes = {
	initName: PropTypes.string,
	scheme: PropTypes.shape({ id: PropTypes.number }),
	formData: PropTypes.array,
	setFormData: PropTypes.func,
};

export default FileManager;
