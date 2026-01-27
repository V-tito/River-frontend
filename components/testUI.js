//import DataTable from "./views/dataTable"
import JsonEditor from './testViews/jsonEditor';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const TestUI = ({ scheme }) => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);
	if (!isClient) return <p>Loading...</p>;
	return <JsonEditor scheme={scheme.name}></JsonEditor>;
};
TestUI.propTypes = {
	scheme: PropTypes.shape({ name: PropTypes.string }),
};
export default TestUI;
