'use client';
import React from 'react';
import styles from './leftSidebar.module.css';
import NavigationBar from './leftSidebarContents/navigationBar';
import ErrorIndicatorBar from './leftSidebarContents/errorIndicatorBar';
import { usePathname } from 'next/navigation';
import { useGlobal } from '../app/GlobalState';
import PropTypes from 'prop-types';

const LeftSidebar = ({ children }) => {
	const { defaultScheme, pollingError } = useGlobal();
	const pathname = usePathname();
	const pathSegments = pathname.split('/');
	const pagename = pathSegments[pathSegments.length - 1];
	return (
		<div className={styles.navigation_wrapper}>
			<aside className={styles.sidebar}>
				<NavigationBar></NavigationBar>
				<div className={styles.currentScheme}>
					<p>
						Текущая схема:{' '}
						{defaultScheme == null ? 'не задана' : defaultScheme.name}
					</p>
				</div>
				{pagename == 'StateOfSignals' ? (
					<ErrorIndicatorBar
						err={pollingError}
						table="signals"
					></ErrorIndicatorBar>
				) : (
					''
				)}
				{pagename == 'StateOfBoards' ? (
					<ErrorIndicatorBar
						err={pollingError}
						table="boards"
					></ErrorIndicatorBar>
				) : (
					''
				)}
			</aside>
			<main className={styles.main}>{children}</main>
		</div>
	);
};

LeftSidebar.propTypes = {
	children: PropTypes.node,
};

export default LeftSidebar;
