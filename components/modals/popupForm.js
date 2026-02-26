'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import styles from './modal.module.css';
import './popup.css';

const PopupForm = ({ buttonLabel, children }) => {
	return (
		<Popup
			trigger={
				<button
					className={`${styles.button} ${styles.buttonFlex} ${styles.menuButton}`}
				>
					{buttonLabel}
				</button>
			}
			closeOnDocumentClick={false}
		>
			{close => (
				<div className={styles.container}>
					<button
						onClick={() => close()}
						className={`${styles.button} ${styles.closeButton}`}
					>
						&times;
					</button>
					{children}
				</div>
			)}
		</Popup>
	);
};

PopupForm.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
	children: PropTypes.node,
};

export default PopupForm;
