import React from 'react';
import styles from './fileBar.module.css';
import DeleteButton from './delButton';
import DownloadButton from './downloadButton';
import PropTypes from 'prop-types';

const FileBar = ({ folder, filename }) => {
	return (
		<div className={styles.bar}>
			<a href={`/tester/TestEditor?folder=${folder}&filename=${filename}`}>
				{filename}
			</a>
			<DeleteButton
				filepath={`?folder=${folder}&filename=${filename}`}
			></DeleteButton>
			<DownloadButton
				filepath={`?folder=${folder}&filename=${filename}`}
				filename={filename}
			></DownloadButton>
		</div>
	);
};
FileBar.propTypes = {
	folder: PropTypes.string,
	filename: PropTypes.string,
};
export default FileBar;
