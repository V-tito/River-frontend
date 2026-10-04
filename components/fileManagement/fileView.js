import { React, useEffect, useState } from 'react';
import FileBar from './fileBar';
import PropTypes from 'prop-types';
import Modal from '../modals/inlineModal';
import UploadFileModal from './uploadFileModal';

const FileView = ({ folder }) => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const response = await fetch(`/api/files/gen?folder=${folder}`, {
					method: 'GET',
				});
				if (!response.ok) {
					throw new Error(
						`Ошибка сети ${response.status}: ${response.message ? response.message : ''}`
					);
				}
				const result = await response.json();
				const fileList = result.files;
				setFiles(fileList);
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

	if (loading) return <p>Загрузка...</p>;
	return (
		<div>
			{Array.isArray(files)
				? files.map(file => (
						<FileBar key={file} folder={folder} filename={file}></FileBar>
					))
				: ''}
			<Modal state={error}>{error ? error.message : ''}</Modal>
			<UploadFileModal folder={folder}></UploadFileModal>
		</div>
	);
};
FileView.propTypes = {
	folder: PropTypes.string,
};
export default FileView;
