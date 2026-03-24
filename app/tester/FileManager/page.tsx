'use client';

import React from 'react';
import FileUI from '../../../components/fileUI';
import { useGlobal } from '../../GlobalState';
import headerStyles from '@/styles/headerStyles.module.css';

const FileManagerPage = () => {
	const { defaultScheme } = useGlobal();
	if (defaultScheme !== undefined) {
		return <FileUI scheme={defaultScheme}></FileUI>;
	} else {
		return <p className={headerStyles.warning}>Установите схему</p>;
	}
};
export default FileManagerPage;
