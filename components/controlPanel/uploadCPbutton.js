import React, { useEffect, useState } from 'react';
import OpenLocalFileModal from '../modals/openLocalFileModal';
import { postCP } from '@/utils/api_wrap/fileAPI';
export default function UploadCPbutton({ envName, initCPs }) {
	const [uploadError, setUploadError] = useState(null);
	const handleFileUpload = async (e, file) => {
		e.preventDefault();
		try {
			await postCP(envName, file.name, file);
			await initCPs();
		} catch (err) {
			setUploadError(err);
		}
	};
	return (
		<OpenLocalFileModal
			uploadAction={handleFileUpload}
			uploadError={uploadError}
			label="Добавить панель управления"
		/>
	);
}
