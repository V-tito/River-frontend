'use client';
import React, { useEffect, useState } from 'react';
import AlterModal from '../../modals/alterModal';
import styles from './cards.module.css';
import PropTypes from 'prop-types';
import ConfirmDeleteModal from '@/components/modals/confirmDeleteModal';

const ItemCard = ({ type, item }) => {
	const [config, setConfig] = useState({ features: [], types: [] });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchConfig = async () => {
			const response = await fetch(`/api/getCardConfig/${type}`);
			const data = await response.json();
			setConfig(data);
			console.log('card config', data);
		};
		console.log('effect');
		fetchConfig();
		setLoading(false);
	}, []);

	if (loading) return <p>Загрузка плитки...</p>;

	return (
		<div className={styles.card}>
			<h1 className={styles.header}>{item.name}</h1>
			{config['features'].map(feat =>
				feat.long ? (
					<div key={feat.id}>
						<p className={styles.feature}>{feat.label}</p>
						<span>{item[feat.id]}</span>
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
			<p className={styles.description}>{item.description}</p>
			<div className="flex flex-row align-center">
				<AlterModal table={type} obj={item}></AlterModal>
				<ConfirmDeleteModal
					state={{
						type: type,
						name: item.name,
						group: item.parentGroup ? item.parentGroup : null,
					}}
				></ConfirmDeleteModal>
			</div>
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
