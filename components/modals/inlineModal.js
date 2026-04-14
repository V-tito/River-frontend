import React, { useEffect, useState } from 'react';
import styles from './modal.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';

import PropTypes from 'prop-types';
const InlineModal = ({ state, children }) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(state != null && state != false);
	}, [state]);

	const onClose = () => {
		setIsVisible(false);
	};
	if (!isVisible) return null;
	console.log('imc', children);
	return (
		<div className={styles.containerInline}>
			{children}
			<button
				onClick={onClose}
				className={`${buttonStyles.button} ${styles.deleteButtonInline}`}
			>
				Закрыть
			</button>
		</div>
	);
};
InlineModal.propTypes = {
	state: PropTypes.any,
	children: PropTypes.node,
};
export default InlineModal;
