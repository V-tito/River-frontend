'use client';
import React from 'react';
import styles from './leftSidebar.module.css';
import NavigationBar from './navAndTrivial/navigationBar';
import ErrorIndicatorBar from './navAndTrivial/errorIndicatorBar';
import { useGlobal } from '../app/GlobalState';
import PropTypes from 'prop-types';

const LeftSidebar = ({ children }) => {
	const { defaultScheme, pollingError } = useGlobal();
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
