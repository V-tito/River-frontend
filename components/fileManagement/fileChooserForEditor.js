import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../modals/inlineModal';
import FlexMenuButton from '../templateComponents/buttons/flexMenuButton';
import PopupForm from '../templateComponents/popupForm';
import PopupControlled from '../templateComponents/popupControlled';

import { Upload, Save, Download, FilePlus } from '@deemlol/next-icons';
import { getDirectoryStats } from '@/utils/api_wrap/fileAPI';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
const FileChooser = ({ envName, category, openFile }) => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [open, setOpen] = useState(false);
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const fileList = await getDirectoryStats(category, envName);
				console.debug('got files list in file browser', fileList);
				setFiles(fileList);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		if (envName !== undefined && category !== undefined) {
			fetchFiles();
		}
	}, []);
	if (loading) return <p>Загрузка...</p>;
	return (
		<>
			<FlexMenuButton
				buttonTitle={'Открыть файл из хранилища рабочего пространства'}
				buttonLabel={<FilePlus></FilePlus>}
				onClick={() => setOpen(true)}
			/>
			<PopupControlled
				open={open}
				setOpen={setOpen}
				label={'Открыть файл из хранилища рабочего пространства'}
			>
				<p>Нажмите на название файла, чтобы открыть</p>
				{Array.isArray(files)
					? files.map((file, index) => (
							<button
								key={index}
								onClick={async () => {
									try {
										await openFile(file.name);
										setOpen(false);
									} catch (err) {
										setError(err);
									}
								}}
								className={headerStyles.fold}
							>
								{file.name}
							</button>
						))
					: ''}
				<Modal state={error}>{error?.message ?? 'Ошибка: успешно!'}</Modal>
			</PopupControlled>
		</>
	);
};
FileChooser.propTypes = {
	folder: PropTypes.string,
};
export default FileChooser;
