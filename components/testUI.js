//import DataTable from "./views/dataTable"
import JsonEditor from './testViews/jsonEditor';
import React from 'react';
import PropTypes from 'prop-types';
const TestUI = ({ scheme }) => {
	return <JsonEditor scheme={scheme}></JsonEditor>;
};
TestUI.propTypes = {
	scheme: PropTypes.shape({}),
};
export default TestUI;
