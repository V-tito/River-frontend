import React from 'react';
import styles from '../controlPanel.module.css';
function CPerrors({ errorList }) {
	console.debug('errors', errorList);
	return (
		<div className={styles.errs}>
			{errorList.map((err, index) => (
				<span key={index} className={styles.error}>
					{err}
				</span>
			))}
		</div>
	);
}
export default CPerrors;
