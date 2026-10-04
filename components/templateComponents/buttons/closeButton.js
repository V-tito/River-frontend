import React from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import { X } from '@deemlol/next-icons';
export default function CloseButton({ closeAction, className = '' }) {
	return (
		<button
			onClick={() => closeAction()}
			className={`${buttonStyles.button} ${buttonStyles.closeButton} ${className}`}
		>
			<X />
		</button>
	);
}
