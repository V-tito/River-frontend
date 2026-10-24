import React, { useContext } from 'react';
import styles from './editor.module.css';
import colorStyles from './commandStatusColors.module.css';
import PropTypes from 'prop-types';
import { execAndMouseDisplayContext } from './editor';
const LogListWithHighlights = ({ results, formatter }) => {
	const { isHovered, setIsHovered } = useContext(execAndMouseDisplayContext);
	return (
		<div className={styles.editor}>
			{results.map((result, i) => (
				<p
					onMouseEnter={() => {
						console.debug('in results, set IsHovered as', result.commandID);
						setIsHovered(result.commandID);
					}}
					onMouseLeave={() => setIsHovered(null)}
					key={i}
					className={`${colorStyles[result.actionType]} ${result.commandID != null && result.commandID != undefined && isHovered == result.commandID ? colorStyles.active : ''}`}
				>
					{formatter(result)}
				</p>
			))}
		</div>
	);
};
LogListWithHighlights.propTypes = {
	results: PropTypes.array,
	isHovered: PropTypes.number,
	setIsHovered: PropTypes.func,
};
export default LogListWithHighlights;
