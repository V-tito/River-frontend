'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import styles from './modal.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import './popup.css';

const PopupForm = ({ buttonLabel, children }) => {
	return (
		<Popup
			trigger={
				<button
					className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
				>
					{buttonLabel}
				</button>
			}
			closeOnDocumentClick={false}
		>
			{close => (
				<div className={styles.container}>
					<div className={buttonStyles.delGrid}>
						<p className={headerStyles.modalHeader}>{buttonLabel}</p>
						<button
							onClick={() => close()}
							className={`${buttonStyles.button} ${buttonStyles.closeButton}`}
						>
							&times;
						</button>
					</div>
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
