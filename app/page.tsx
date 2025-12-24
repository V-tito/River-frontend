//import SetDefaultScheme from "../components/forms/setDefaultSchemeForm"
//<SetDefaultScheme></SetDefaultScheme>
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
const Home = () => {
	const router = useRouter();
	return (
		<div>
			<p>Программа тестирования СУЛ &quot;Река&quot;</p>
			Выберите профиль:
			<button
				onClick={() => {
					router.push(`/admin`);
				}}
			>
				admin
			</button>
			<button
				onClick={() => {
					router.push(`/tester`);
				}}
			>
				tester
			</button>
		</div>
	);
};
export default Home;
