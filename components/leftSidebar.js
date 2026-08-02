'use client';
import React from 'react';
import styles from './leftSidebar.module.css';
import NavigationBar from './navAndTrivial/navigationBar';
import ErrorIndicatorBar from './navAndTrivial/errorIndicatorBar';
import { useGlobal } from '../app/GlobalState';
import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';
import SchemeToggler from '@/components/forStatePages/schemeToggler';
import dynamic from 'next/dynamic';

const SchemeUtils = dynamic(() => import('./navAndTrivial/schemeUtils'), {
	ssr: false,
});
const LeftSidebar = ({ children }) => {
	const path = usePathname();
	const { defaultScheme, pollingError } = useGlobal();
	return (
		<div className={styles.navigation_wrapper}>
			<aside className={styles.sidebar}>
				<NavigationBar></NavigationBar>
				<SchemeUtils
					defaultScheme={defaultScheme}
					admin={path.split('/')[1] == 'admin'}
				/>
				{path.split('/')[1] == 'shared' ? <SchemeToggler></SchemeToggler> : ''}
				<ErrorIndicatorBar err={pollingError}></ErrorIndicatorBar>
			</aside>
			<main className={styles.main}>{children}</main>
		</div>
	);
};

LeftSidebar.propTypes = {
	children: PropTypes.node,
};

export default LeftSidebar;
