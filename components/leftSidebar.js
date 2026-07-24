'use client';
import React from 'react';
import styles from './leftSidebar.module.css';
import NavigationBar from './navAndTrivial/navigationBar';
import ErrorIndicatorBar from './navAndTrivial/errorIndicatorBar';
import EnvDownload from '@/components/fileManagement/envDownload';
import EnvUpload from '@/components/fileManagement/envUpload';
import { useGlobal } from '../app/GlobalState';
import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';
import SchemeToggler from '@/components/forStatePages/schemeToggler';

const LeftSidebar = ({ children }) => {
	const path = usePathname();
	const { defaultScheme, pollingError, navProfile } = useGlobal();
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
				{path.split('/')[1] == 'admin' ? (
					<div>
						{defaultScheme == null ? (
							''
						) : (
							<EnvDownload defaultScheme={defaultScheme.name}></EnvDownload>
						)}
						<EnvUpload></EnvUpload>
					</div>
				) : (
					''
				)}
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
