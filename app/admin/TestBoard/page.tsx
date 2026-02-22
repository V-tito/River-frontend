'use client';
//import RedirectForm from "../../components/redirect_form_for_board_nav"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGlobal } from '../../GlobalState';
const RedirectStub = () => {
	const { defaultScheme } = useGlobal();
	const router = useRouter();
	useEffect(() => {
		router.push(`/admin/TestBoard/${defaultScheme.name}`);
	});
	//return (<div><p>{"Введите номер схемы"}</p><RedirectForm table="TestBoard"></RedirectForm></div>)
};
export default RedirectStub;
