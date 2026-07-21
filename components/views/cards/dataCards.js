import ItemCard from './itemCard';
import AddCard from './addCard';
import React, { useEffect, useState } from 'react';
import styles from './cards.module.css';
import PropTypes from 'prop-types';

const DataCards = ({ type, data, label }) => {
	const [config, setConfig] = useState({ features: [], types: [] });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchConfig = async () => {
			const response = await fetch(`/api/getCardConfig/${type}`);
			const data = await response.json();
			setConfig(data);
		};
		fetchConfig();
		setLoading(false);
	}, []);

	if (loading) return <p>Загрузка плитки...</p>;
	return (
		<div className={styles.container}>
			<div className={styles.cardsGrid}>
				{data.length > 0
					? data.map(item =>
							item ? (
								<ItemCard
									key={item.name}
									type={type}
									item={item}
									config={config}
								></ItemCard>
							) : (
								''
							)
						)
					: null}
				{(type == 'Sul') & (data.length > 0) ? null : (
					<AddCard type={type}></AddCard>
				)}
			</div>
		</div>
	);
};
DataCards.propTypes = {
	kind: PropTypes.string,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			description: PropTypes.string,
		})
	),
};
export default DataCards;
