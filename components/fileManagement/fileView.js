import { React, useEffect, useState } from 'react';
import FileBar from './fileBar';
import PropTypes from 'prop-types';
import Modal from '../modals/inlineModal';
import styles from './fileBar.module.css';
import PopupForm from '../modals/popupForm';

const FileView = ({ folder }) => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fileForUpload, setFileForUpload] = useState(null);
	//const url = new URL(`/api/files?folder=${folder}`);
	//url.searchParams.set('folder', folder);
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const response = await fetch(`/api/files?folder=${folder}`, {
					method: 'GET',
				});
				console.log(response.ok);
				console.log(response);
				if (!response.ok) {
					throw new Error(
						`Ошибка сети ${response.status}: ${response.message ? response.message : ''}`
					);
				}
				const result = await response.json();
				console.log('res', result);
				const fileList = result.files;
				setFiles(fileList);
				console.log('resfiles', fileList);
				console.log('resfilesIsArray', Array.isArray(fileList));
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		if (folder !== undefined) {
			fetchFiles();
		}
	}, []);
	const handleFileChange = event => {
		setFileForUpload(event.target.files[0]);
	};
	const handleFileUpload = async e => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('file', fileForUpload);
		console.log(formData);
		console.log(fileForUpload.name);
		const response = await fetch(`/api/files?folder=${folder}`, {
			method: 'POST',
			body: formData,
		});

		if (response.ok) {
			console.log('File uploaded successfully');
		} else {
			console.error('Error uploading file');
		}
		window.location.reload();
	};
	if (loading) return <p>Loading...</p>;
	return (
		<div className="flex flex-row">
			<div className="flex flex-col">
				{Array.isArray(files)
					? files.map(file => (
							<FileBar key={file} folder={folder} filename={file}></FileBar>
						))
					: ''}
				<Modal state={error}>{error ? error.message : ''}</Modal>
			</div>
			<PopupForm buttonLabel={'Загрузить скрипт на сервер'}>
				<input
					className={styles.button}
					type="file"
					accept=".json,application/json"
					onChange={e => handleFileChange(e)}
				/>
				<button onClick={handleFileUpload} className={styles.button}>
					Загрузить
				</button>
				<Modal state={error}>{error ? error.message : ''}</Modal>
			</PopupForm>
		</div>
	);
};
FileView.propTypes = {
	folder: PropTypes.string,
};
export default FileView;
