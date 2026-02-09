import React from 'react';
import styles from './editor.module.css';
import PropTypes from 'prop-types';
const ResultsViewWithHighlight = ({ results, isHovered, setIsHovered }) => {
	return (
		<div className={styles.editor}>
			{results.map((result, i) => (
				<p
					onMouseEnter={() => setIsHovered(i)}
					onMouseLeave={() => setIsHovered(null)}
					key={i}
					className={`${styles[result.actionType]} ${isHovered == result.id ? styles.active : ''}`}
				>
					{result.timestamp} : {result.res}
				</p>
			))}
		</div>
	);
};
ResultsViewWithHighlight.propTypes = {
	results: PropTypes.array,
	isHovered: PropTypes.number,
	setIsHovered: PropTypes.func,
};
export default ResultsViewWithHighlight;
