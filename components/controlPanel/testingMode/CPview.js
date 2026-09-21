import React, { useEffect, useState } from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { useGlobal } from '../../../app/GlobalState';
import CPgrid from './CPgrid';
import ChooseCP from './chooseCP';
//func for validating current cp
function CPview({ className = '' }) {
	const [currentCP, setCurrentCP] = useState(null);
	const [currentContent, setCurrentContent] = useState({});
	useEffect(() => {}, [currentCP]);
	return <div className={className}></div>;
}
