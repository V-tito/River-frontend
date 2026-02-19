'use client';
//import RedirectForm from "../../components/redirect_form_for_board_nav"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGlobal } from '../../GlobalState';
const RedirectStub = () => {
	const { defaultScheme } = useGlobal();
	console.log(defaultScheme)
	const router = useRouter();
	useEffect(() => {
		router.push(`/admin/GroupOfSignals/${defaultScheme.name}`);
	});
	//return (<div><p>{"Введите номер схемы"}</p><RedirectForm table="TestBoard"></RedirectForm></div>)
};
export default RedirectStub;
