'use client';

import React from 'react';
import TestUI from '../../../components/testUI';
import { useGlobal } from '../../GlobalState';

const TesterPage = () => {
	const { defaultScheme } = useGlobal();
	return <TestUI scheme={defaultScheme}></TestUI>;
};
export default TesterPage;
