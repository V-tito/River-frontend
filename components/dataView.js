//import DataTable from "./views/dataTable"
import DataCards from './views/cards/dataCards';
import PropTypes from 'prop-types';
import React from 'react';
const DataView = ({ data, kind, label }) => {
	return <DataCards data={data} type={kind} label={label}></DataCards>;
};

DataView.propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({})),
	kind: PropTypes.string,
};
export default DataView;
