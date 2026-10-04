import React from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import CloseButton from './closeButton';
export default function HeaderWithCloseButton({ header, closeAction }) {
	return (
		<div className={buttonStyles.delGrid}>
			<p className={headerStyles.modalHeader}>{header}</p>
			<CloseButton closeAction={closeAction} />
		</div>
	);
}
