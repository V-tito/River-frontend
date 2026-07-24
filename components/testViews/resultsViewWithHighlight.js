import React, { useContext } from 'react';
import styles from './editor.module.css';
import colorStyles from './commandStatusColors.module.css';
import PropTypes from 'prop-types';
import { execAndMouseDisplayContext } from './editor';
const ResultsViewWithHighlight = ({ results }) => {
	const { isHovered, setIsHovered } = useContext(execAndMouseDisplayContext);
	return (
		<div className={styles.editor}>
			{results.map((result, i) => (
				<p
					onMouseEnter={() => {
						console.debug('in results, set IsHovered as', result.id);
						setIsHovered(result.id);
					}}
					onMouseLeave={() => setIsHovered(null)}
					key={i}
					className={`${colorStyles[result.actionType]} ${result.id != null && result.id != undefined && isHovered == result.id ? colorStyles.active : ''}`}
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
