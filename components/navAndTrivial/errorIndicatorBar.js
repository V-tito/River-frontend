import styles from './errorIndicatorBar.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import headerStyles from '@/styles/headerStyles.module.css';
const ErrorIndicatorBar = ({ err = null }) => {
	return (
		<div
			className={`${styles.eba} ${
				err == null ? styles.none : err == 'ok' ? styles.ok : styles.error
			}`}
		>
			<p className={headerStyles.modalHeader}>Связь с сервером:</p>
			{err == null ? (
				<p>Запросы не производятся...</p>
			) : err == 'ok' ? (
				<p>Соединение успешно</p>
			) : (
				<p>{err.message}</p>
			)}
		</div>
	);
};
ErrorIndicatorBar.propTypes = {
	err: PropTypes.shape({
		message: PropTypes.string,
	}),
};
export default ErrorIndicatorBar;
