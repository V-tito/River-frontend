'use client';
//import JsonEditor from './testViews/jsonEditor';
import Editor from './testViews/editAndResultsWindowPair';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const TestUI = ({ scheme }) => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);
	if (!isClient) return <p>Загрузка...</p>;
	return <Editor scheme={scheme}></Editor>;
};
TestUI.propTypes = {
	scheme: PropTypes.shape({ name: PropTypes.string }),
};
export default TestUI;
