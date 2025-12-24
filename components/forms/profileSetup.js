'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import styles from './form.module.css';

const ProfileSetup = () => {
	const router = useRouter();
	return (
		<div className={styles.form}>
			<p>Выберите профиль:</p>
			<button
				className={styles.button}
				onClick={() => {
					router.push(`/admin`);
				}}
			>
				admin
			</button>
			<button
				className={styles.button}
				onClick={() => {
					router.push(`/tester`);
				}}
			>
				tester
			</button>
		</div>
	);
};
export default ProfileSetup;
