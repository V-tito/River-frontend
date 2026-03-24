//import SetDefaultScheme from "../components/forms/setDefaultSchemeForm"
//<SetDefaultScheme></SetDefaultScheme>

import React from 'react';
import ProfileSetup from '../components/forms/profileSetup';
import headerStyles from '@/styles/headerStyles.module.css';

const Home = () => {
	return (
		<div>
			<h1 className={headerStyles.mainHeader}>
				Программа тестирования СУЛ &quot;Река&quot;
			</h1>
			<ProfileSetup></ProfileSetup>
		</div>
	);
};
export default Home;
