import { React, useEffect, useState } from 'react';
import FileBar from './fileBar';
import PropTypes from 'prop-types';
import Modal from '../modals/inlineModal';
const FileView = ({ folder }) => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
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
	if (loading) return <p>Loading...</p>;
	return (
		<div>
			{Array.isArray(files)
				? files.map(file => <FileBar key={file} filename={file}></FileBar>)
				: ''}
			<Modal state={error}>{error ? error.message : ''}</Modal>
		</div>
	);
};
FileView.propTypes = {
	folder: PropTypes.string,
};
export default FileView;
