import React from 'react';
import styles from './fileBar.module.css';
import DeleteButton from './delButton';
import DownloadButton from './downloadButton';
import PropTypes from 'prop-types';
import headerStyles from '@/styles/headerStyles.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';

const FileBar = ({ folder, filename }) => {
	return (
		<div className={styles.bar}>
			<a
				className={styles.name}
				href={`/tester/TestEditor?folder=${folder}&filename=${filename}`}
			>
				{filename}
			</a>
			<DeleteButton
				className={`${buttonStyles.button} ${buttonStyles.deleteButton}`}
				filepath={`?folder=${folder}&filename=${filename}`}
			></DeleteButton>
			<DownloadButton
				className={`${buttonStyles.button} ${buttonStyles.menuButton}`}
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
