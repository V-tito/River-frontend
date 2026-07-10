import React, { useContext } from 'react';
import styles from './editor.module.css';
import PropTypes from 'prop-types';
import { execAndMouseDisplayContext } from './editor';
const ResultsViewWithHighlight = ({ results }) => {
	const { isHovered, setIsHovered } = useContext(execAndMouseDisplayContext);
	return (
		<div className={styles.editor}>
			{results.map((result, i) => (
				<p
					onMouseEnter={() => setIsHovered(result.id)}
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
