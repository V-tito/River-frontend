'use client';
import React from 'react';
import AlterModal from '../../modals/alterModal';
import AddCopyModal from '../../modals/addCopyModal';
import styles from './cards.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import PropTypes from 'prop-types';
import ConfirmDeleteModal from '@/components/modals/confirmDeleteModal';

const ItemCard = ({ type, item, config }) => {
	console.log('item card with item', item);
	return (
		<div className={styles.card}>
			<h1 className={headerStyles.modalHeader}>{item.name}</h1>
			{config['features'].map(feat =>
				feat.long ? (
					<div key={feat.id}>
						<p className={styles.feature}>{feat.label}</p>
						<span className={styles.longFeat}>{item[feat.id]}</span>
					</div>
				) : (
					<p key={feat.id}>
						<span className={styles.feature}>{feat.label}</span>
						<span>
							{typeof item[feat.id] === 'object' && item[feat.id] !== null
								? item[feat.id].name
								: item[feat.id]}
						</span>
					</p>
				)
			)}
			{'types' in config ? (
				<div className={styles.types}>
					{config['types'].map(type_ => (
						<div
							key={type_.id}
							className={`${styles.type} ${
								item[type_.id] ? styles.true : styles.false
							}`}
						>
							{type_.alias[item[type_.id]]}
						</div>
					))}
				</div>
			) : null}
			<span className={styles.description}>{item.description}</span>
			<div className={buttonStyles.buttons}>
				<AlterModal table={type} obj={item}></AlterModal>
				<ConfirmDeleteModal
					state={{
						type: type,
						name: item.name,
						group: item.parentGroup ? item.parentGroup : null,
					}}
				></ConfirmDeleteModal>
			</div>
			<AddCopyModal table={type} object={item}></AddCopyModal>
		</div>
	);
};
ItemCard.propTypes = {
	type: PropTypes.string,
	item: PropTypes.shape({
		name: PropTypes.string,
		description: PropTypes.string,
	}),
};
export default ItemCard;
