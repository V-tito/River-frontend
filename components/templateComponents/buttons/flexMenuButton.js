import React from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
export default function FlexMenuButton({ buttonTitle, buttonLabel, onClick }) {
	return (
		<button
			title={buttonTitle}
			className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
			onClick={onClick}
		>
			{buttonLabel}
		</button>
	);
}
