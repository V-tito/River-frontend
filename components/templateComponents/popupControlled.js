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

export default function PopupControlled({
	open,
	setOpen,
	label = null,
	children,
}) {
	return (
		<Popup
			open={open}
			closeOnDocumentClick={false}
			onClose={() => setOpen(false)}
		>
			<div className={styles.container}>
				<HeaderWithCloseButton
					header={label}
					closeAction={() => setOpen(false)}
				/>
				{children}
			</div>
		</Popup>
	);
}
