import React from 'react';
import PropTypes from 'prop-types';
const DownloadButton = ({ filepath, filename }) => {
	const api = `/api/files${filepath}`;
	const onDownload = async () => {
		const response = await fetch(api, {
			method: 'GET',
		});
		const result = await response.blob();
		// Create a download link
		const url = URL.createObjectURL(result);
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
	return <button onClick={onDownload}>Загрузить</button>;
};

DownloadButton.propTypes = {
	filepath: PropTypes.string,
	filename: PropTypes.string,
};
export default DownloadButton;
