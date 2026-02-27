'use client';
import React, { useEffect, useState } from 'react';
import styles from './navigation.module.css';
import Link from 'next/link';
import { useGlobal } from '../../app/GlobalState';
import { usePathname } from 'next/navigation';

const NavigationBar = () => {
	const path = usePathname();
	console.log('path', path);
	const defConfig = JSON.parse(
		'{"common":[{"id":0,"name":"Главная","link":"/"}],"schemeDependent":[]}'
	);
	const [config, setConfig] = useState(defConfig);
	const [currentPath, setCurrentPath] = useState(path);
	const { defaultScheme, navProfile, setNavProfile } = useGlobal();

	useEffect(() => {
		console.log('pathInEffect', path);
		setCurrentPath(path);
		console.log('currentPath', currentPath);
		console.log('split path', path.split('/')[1]);
		let addr;
		if (path.split('/')[1] != 'shared') {
			setNavProfile(path.split('/')[1]);
			console.log('set nav profile');
			addr = path.split('/')[1];
		} else addr = navProfile;

		console.log('nav profile', navProfile);
		const fetchConfig = async () => {
			try {
				const response = await fetch(`/api/getNavigationConfig/${addr}`);
				const data = await response.json();
				console.log('nav data', data);
				setConfig(data);
				console.log(data);
			} catch {
				setConfig(defConfig);
			}
		};

		fetchConfig();
	}, [path]);
	console.log('nav conf', config);
	console.log('link', `/${navProfile} `);

	return (
		<div className={styles.sidebar}>
			<nav className={styles.nav}>
				<ul>
					{config.common.map(item => (
						<li
							className={`${styles.li} ${
								item.link == currentPath ||
								(item.link != `/` &&
									item.link != `/${navProfile}` &&
									currentPath.includes(item.link))
									? styles.activeTab
									: ''
							}`}
							key={item.id}
						>
							<Link href={item.link}>{item.name}</Link>
						</li>
					))}
					{defaultScheme == null
						? ''
						: config.schemeDependent.map(item => (
								<div key={item.id}>
									<li
										className={`${styles.li} ${
											currentPath.includes(item.link) ? styles.activeTab : ''
										}`}
									>
										<Link href={item.link}>{item.name}</Link>
									</li>
								</div>
							))}
				</ul>
			</nav>
		</div>
	);
};
export default NavigationBar;
