import React, { useState } from 'react';
import SaveFromEditorToServerModal from '../modals/saveFromEditorToServerModal';
import OpenLocalFileModal from '../modals/openLocalFileModal';
import FileChooser from '../fileManagement/fileChooserForEditor';
import SaveFromVarLocally from '../modals/saveFromVarLocally';
import styles from './editor.module.css';
import { Upload, Save, Download, FilePlus } from '@deemlol/next-icons';
import PropTypes from 'prop-types';
const FileManager = ({
	currentTabId,
	tabs,
	addTab,
	renameTab,
	resetTabContent,
	scheme,
}) => {
	const [readerError, setReaderError] = useState(null);
	const handleFileRead = (event, file) => {
		if (!file) return;

		const reader = new FileReader();

		reader.onload = async e => {
			try {
				const content = e.target.result;
				const newTabId = await addTab();
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
	console.debug('current tab name in file manager', tabs[currentTabId].name);
	return (
		<div className={styles.buttons}>
			<OpenLocalFileModal
				uploadAction={handleFileRead}
				uploadError={readerError}
				closeAfter={true}
			></OpenLocalFileModal>
			<SaveFromEditorToServerModal
				formData={currentTabId ? tabs[currentTabId].content : []}
				initName={currentTabId ? tabs[currentTabId].name : ''}
				scheme={scheme}
			></SaveFromEditorToServerModal>
			<SaveFromVarLocally
				formData={currentTabId ? tabs[currentTabId].content : []}
				initName={currentTabId ? tabs[currentTabId].name : ''}
				label={<Download />}
				title="Экспорт скрипта"
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
