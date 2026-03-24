import SetDefaultScheme from '../../components/forms/setDefaultSchemeForm';
import React from 'react';
import headerStyles from '@/styles/headerStyles.module.css';
const Home = () => {
	return (
		<div>
			<p className={headerStyles.mainHeader}>
				Программа тестирования СУЛ &quot;Река&quot;
			</p>
			<SetDefaultScheme></SetDefaultScheme>
		</div>
	);
};
export default Home;
