'use client';

import React from 'react';
import TestUI from '../../../components/testUI';
import { useGlobal } from '../../GlobalState';

const TesterPage = () => {
	const { currentWS } = useGlobal();
	console.info('entered TestEditor page');
	return <TestUI scheme={currentWS}></TestUI>;
};
export default TesterPage;
