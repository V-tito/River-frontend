'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import styles from './cards.module.css';
import modalStyles from '@/components/modals/modal.module.css';
import '@/components/modals/popup.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import AddFromFileModal from '@/components/modals/addFromFileModal';
import AddModal from '@/components/modals/addModal';
const AddCard = ({ type }) => {
	console.log('type in addCard', type);
	return (
		<Popup
			trigger={
				<button className={`${styles.card}`}>
					<div className={styles.plusContainer}>
						<span className={styles.plusSymbol}>+</span>
						<span className={styles.plusText}>Новый элемент</span>
					</div>
				</button>
			}
			closeOnDocumentClick={false}
		>
			{close => (
				<div className={modalStyles.container}>
					<div className={buttonStyles.delGrid}>
						<p className={headerStyles.modalHeader}>Создать элемент</p>
						<button
							onClick={() => close()}
							className={`${buttonStyles.button} ${buttonStyles.closeButton}`}
						>
							&times;
						</button>{' '}
					</div>

					<div className={buttonStyles.buttons}>
						<AddModal table={type}></AddModal>
						<AddFromFileModal table={type}></AddFromFileModal>
					</div>
				</div>
			)}
		</Popup>
	);
};
export default AddCard;
