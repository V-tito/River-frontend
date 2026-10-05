'use client';

import React from 'react';
import FileUI from '../../../components/fileUI';
import { useGlobal } from '../../GlobalState';
import headerStyles from '@/styles/headerStyles.module.css';

const FileManagerPage = () => {
	const { currentWS } = useGlobal();
	if (currentWS !== undefined) {
		return <FileUI scheme={currentWS}></FileUI>;
	} else {
		return (
			<p className={headerStyles.warning}>Выберите рабочее пространство</p>
		);
	}
};
export default FileManagerPage;
