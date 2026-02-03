//import JsonEditor from './testViews/jsonEditor';
import CommandBarEditor from './testViews/commandBars/commandBarEditor';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const TestUI = ({ scheme }) => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);
	if (!isClient) return <p>Loading...</p>;
	return <CommandBarEditor scheme={scheme.name}></CommandBarEditor>;
};
TestUI.propTypes = {
	scheme: PropTypes.shape({ name: PropTypes.string }),
};
export default TestUI;
