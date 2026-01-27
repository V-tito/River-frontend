'use client';

import React from 'react';
import FileUI from '../../../components/fileUI';
import { useGlobal } from '../../GlobalState';

const FileManagerPage = () => {
	const { defaultScheme } = useGlobal();
	if (defaultScheme !== undefined) {
		return <FileUI scheme={defaultScheme}></FileUI>;
	} else {
		return <p>Установите схему</p>;
	}
};
export default FileManagerPage;
