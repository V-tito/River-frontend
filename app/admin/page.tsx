import SetDefaultScheme from '../../components/forms/setDefaultSchemeForm';
import React from 'react';
import headerStyles from '@/styles/headerStyles.module.css';
const Home = () => {
	return (
		<div>
			<h1 className={headerStyles.mainHeader}>
				Программа тестирования СУЛ &quot;Река&quot;
			</h1>
			<SetDefaultScheme></SetDefaultScheme>
		</div>
	);
};
export default Home;
