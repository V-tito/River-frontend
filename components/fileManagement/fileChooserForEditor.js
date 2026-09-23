import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../modals/inlineModal';
import PopupForm from '../modals/popupForm';
import styles from './fileBar.module.css';
import { Upload, Save, Download, FilePlus } from '@deemlol/next-icons';
const FileChooser = ({ folder }) => {
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
		<PopupForm
			buttonLabel={<FilePlus></FilePlus>}
			buttonTitle="Открыть файл из хранилища рабочего пространства"
		>
			<p>Нажмите на название файла, чтобы открыть</p>
			{Array.isArray(files)
				? files.map((file, index) => (
						<div key={index} className={styles.bar}>
							<a href={`/tester/TestEditor?folder=${folder}&filename=${file}`}>
								{file}
							</a>
						</div>
					))
				: ''}
			<Modal state={error}>{error ? error.message : ''}</Modal>
		</PopupForm>
	);
};
FileChooser.propTypes = {
	folder: PropTypes.string,
};
export default FileChooser;
