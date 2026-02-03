import { React, useEffect, useState } from 'react';
import FileBar from './fileBar';
import PropTypes from 'prop-types';
import Modal from '../modals/inlineModal';
import OpenLocalFileModal from '../modals/openLocalFileModal';

const FileView = ({ folder }) => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
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

	const handleFileUpload = async (e, file) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('file', file);
		console.log(formData);
		console.log(file.name);
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
	if (loading) return <p>Загрузка...</p>;
	return (
		<div className="flex flex-row">
			<div className="flex flex-col">
				{Array.isArray(files)
					? files.map(file => (
							<FileBar key={file} folder={folder} filename={file}></FileBar>
						))
					: ''}
				<Modal state={error}>{error ? error.message : ''}</Modal>
				<OpenLocalFileModal
					uploadAction={handleFileUpload}
				></OpenLocalFileModal>
			</div>
		</div>
	);
};
FileView.propTypes = {
	folder: PropTypes.string,
};
export default FileView;
