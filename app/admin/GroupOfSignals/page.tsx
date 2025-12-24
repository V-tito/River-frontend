'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGlobal } from '../../GlobalState';
const RedirectStub = () => {
	const { defaultScheme } = useGlobal();
	const router = useRouter();
	useEffect(() => {
		router.push(`/admin/GroupOfSignals/${defaultScheme.id}`);
	});
};
export default RedirectStub;
