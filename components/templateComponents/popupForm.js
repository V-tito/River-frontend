'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import styles from './modal.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import FlexMenuButton from './buttons/flexMenuButton';
import HeaderWithCloseButton from './buttons/headerWithCloseButton';
import './popup.css';

const PopupForm = ({
	buttonLabel,
	buttonTitle,
	label = null,
	children,
	onOpen,
}) => {
	return (
		<Popup
			trigger={
				<FlexMenuButton buttonTitle={buttonTitle} buttonLabel={buttonLabel} />
			}
			closeOnDocumentClick={false}
			onOpen={onOpen}
		>
			{close => (
				<div className={styles.container}>
					<HeaderWithCloseButton
						header={label ? label : buttonTitle}
						closeAction={close}
					/>
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
