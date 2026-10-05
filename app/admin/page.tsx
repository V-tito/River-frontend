'use client';
import SetCurrentWS from '@/components/forms/setCurrentWSForm';
import React, { Component } from 'react';
import headerStyles from '@/styles/headerStyles.module.css';
const Home = () => {
	return (
		<div>
			<h1 className={headerStyles.mainHeader}>
				Программа тестирования СУЛ &quot;Река&quot;
			</h1>
			<SetCurrentWS></SetCurrentWS>
		</div>
	);
};
export default Home;
