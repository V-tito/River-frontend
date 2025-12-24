import AddForm from './forms/addForm';
import DeleteForm from './forms/deleteForm';
import styles from './addDeleteWrapper.module.css';
import React from 'react';
import PropTypes from 'prop-types';
const AddDeleteWrapper = ({ table, listOfAll, children }) => {
	// className={styles.asideButtons} for aside when buttons
	return (
		<div className={styles.wrap}>
			<div className={styles.main}>{children}</div>
			<aside className={styles.asideForms}>
				<div>
					<AddForm table={table}></AddForm>
					<DeleteForm table={table} listOfAll={listOfAll}></DeleteForm>
				</div>
			</aside>
		</div>
	);
};
AddDeleteWrapper.propTypes = {
	table: PropTypes.string.isRequired,
	listOfAll: PropTypes.arrayOf(PropTypes.shape({})),
	children: PropTypes.node,
};

export default AddDeleteWrapper;
//bebebebababa
//thank fuck
