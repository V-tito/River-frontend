import React, { useState } from 'react';
import InlineModal from '@/components/modals/inlineModal';

import PropTypes from 'prop-types';
const DownloadButton = ({
	filepath,
	filename,
	buttonLabel = 'Загрузить',
	className = '',
}) => {
	const [error, setError] = useState(null);
	const api = `/api/files${filepath}`;
	const onDownload = async () => {
		setError(null);
		const response = await fetch(api, {
			method: 'GET',
		});
		if (!response.ok) {
			const err = await response.json();
			console.log('respm', err.message);
			setError(new Error(`Ошибка сети ${response.status}: ${err.message}`));
			console.log('errm', error.message);
			return;
		}
		const result = await response.json();
		console.log('result', result);
		const blob = new Blob([result.content], {
			type: 'text/json',
		});
		// Create a download link
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		// Set link properties
		link.href = url;
		link.download = filename;
		// Trigger download
		document.body.appendChild(link);
		link.click();
		// Clean up
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};
	console.log('err', error != null ? error.message : 'no err');
	return (
		<div>
			<button className={className} onClick={onDownload}>
				{buttonLabel}
			</button>
			<InlineModal state={error}>
				{error ? error.message : 'no err'}
			</InlineModal>
		</div>
	);
};

DownloadButton.propTypes = {
	filepath: PropTypes.string,
	filename: PropTypes.string,
	className: PropTypes.string,
};
export default DownloadButton;
