'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import styles from './form.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';

const ProfileSetup = () => {
	const router = useRouter();
	return (
		<div className={`${styles.form} ${styles.non_modal_form}`}>
			<p className={headerStyles.modalHeader}>Выберите профиль:</p>
			<button
				className={`${buttonStyles.button}  ${buttonStyles.buttonFlex} ${buttonStyles.menuButton} w-full`}
				onClick={() => {
					router.push(`/admin`);
				}}
			>
				Настройка
			</button>
			<button
				className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton} w-full`}
				onClick={() => {
					router.push(`/tester`);
				}}
			>
				Тестирование
			</button>
		</div>
	);
};
export default ProfileSetup;
