import React, { useState } from 'react';
import SaveFromEditorToServerModal from '../modals/saveFromEditorToServerModal';
import OpenLocalFileModal from '../modals/openLocalFileModal';
import FileChooser from '../fileManagement/fileChooserForEditor';
import SaveFromVarLocally from '../modals/saveFromVarLocally';
import styles from './editor.module.css';
import PropTypes from 'prop-types';
const FileManager = ({
	currentTab,
	addTab,
	renameTab,
	resetTabContent,
	scheme,
}) => {
	const [readerError, setReaderError] = useState(null);
	const handleFileRead = (event, file) => {
		if (!file) return;

		const reader = new FileReader();

		reader.onload = e => {
			try {
				const content = e.target.result;
				const newTabId = addTab();
				if ('name' in file) renameTab(newTabId, file.name);
				resetTabContent(JSON.parse(content), newTabId);
				setReaderError(null);
			} catch (err) {
				setReaderError(err);
				resetTabContent([]);
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
				closeAfter={true}
			></OpenLocalFileModal>
			<SaveFromEditorToServerModal
				formData={currentTab.content}
				initName={currentTab.name}
				scheme={scheme}
			></SaveFromEditorToServerModal>
			<SaveFromVarLocally
				formData={currentTab.content}
				nitName={currentTab.name}
				label="Сохранить как..."
			/>
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
