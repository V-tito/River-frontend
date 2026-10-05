import SetCurrentWS from '@/components/forms/setCurrentWSForm';
import React from 'react';
import headerStyles from '@/styles/headerStyles.module.css';
const Home = () => {
	return (
		<div>
			<p className={headerStyles.mainHeader}>
				Программа тестирования СУЛ &quot;Река&quot;
			</p>
			<SetCurrentWS></SetCurrentWS>
		</div>
	);
};
export default Home;
