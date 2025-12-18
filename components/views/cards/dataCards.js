import ItemCard from './itemCard';
import React from 'react';
import styles from './cards.module.css';
import PropTypes from 'prop-types';

const DataCards = ({ kind, data }) => {
	return (
		<div className={styles.cards}>
			{data.length > 0
				? data.map(item => (
						<ItemCard key={item.name} type={kind} item={item}></ItemCard>
				  ))
				: null}
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
