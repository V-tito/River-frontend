'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DataView from '@/components/dataView';
import { useGlobal } from '@/app/GlobalState';
import { getList } from '@/utils/api_wrap/configAPI';
import headerStyles from '@/styles/headerStyles.module.css';
import CPeditor from '@/components/controlPanel/editingMode/CPeditor';
const CP = () => {
	const { defaultScheme, pollingError, setPollingError } = useGlobal();
	const params = useParams(); // Get URL parameters
	let slug;
	if (params) {
		slug = params.slug;
	} else {
		slug = defaultScheme.name;
	}
	return (
		<div>
			<h1 className={headerStyles.sectionHeader}>
				Редактировать панели управления:
			</h1>
			<CPeditor schemeName={slug} setPollingError={setPollingError}></CPeditor>
		</div>
	);
};

export default CP;
