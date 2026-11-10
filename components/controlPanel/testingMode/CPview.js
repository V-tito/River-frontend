import React, { useEffect, useState, useRef } from 'react';
import CPset from './CPset';
import CPget from './CPget';

import headerStyles from '@/styles/headerStyles.module.css';
import ChooseCP from '../chooseCP';
import { useGlobal } from '@/app/GlobalState';
import { useCPManager } from '../../../utils/hooks/useCPmanager/useCPmanager';
import CPload from './CPload';
import StyledGrid from '../styledGrid';
import useGetterStatetable from '@/utils/hooks/useGetterStateTable';
import UploadCPbutton from '../uploadCPbutton';

function useSetterInit(validSettersRef) {
	const [setterInit, setsetterInit] = useState({});
	const [setterIniting, setSetterIniting] = useState(true);
	const reinit = () => {
		setSetterIniting(true);
		if (Array.isArray(validSettersRef.current))
			setsetterInit(
				validSettersRef.current.reduce((acc, sig) => {
					return { ...acc, [sig.name]: false };
				}, {})
			);
		setSetterIniting(false);
	};
	return { setterInit, setsetterInit, setterIniting, reinit };
}
const Wrapper = ({ className, children }) => {
	return (
		<div
			className={className}
			style={{ marginRight: '5px', display: 'flex', flexDirection: 'column' }}
		>
			<label className={headerStyles.modalHeader}>Панель управления</label>
			{children}
		</div>
	);
};
function CPview({ envName, writeLog, className = '' }) {
	const { setPollingError, schemeOn } = useGlobal();
	const { currentConfName, setCurrentConfName, CPs, initCPs, getValidSignals } =
		useCPManager(envName);
	const validGetters = useRef([]);
	const validSetters = useRef([]);
	const [loading, setLoading] = useState(true);
	const [initError, setInitError] = useState(null);
	const onRef = useRef(schemeOn);
	useEffect(() => {
		onRef.current = schemeOn;
	});
	const { getterStates, loadingTable, resetPolling } = useGetterStatetable(
		envName,
		onRef,
		validGetters,
		setPollingError
	);
	const { setterInit, setsetterInit, setterIniting, reinit } =
		useSetterInit(validSetters);
	useEffect(() => {
		const init = async () => {
			setLoading(true);
			try {
				await initCPs();
			} catch (err) {
				setInitError(err);
				console.debug('some err initing testing cps');
			} finally {
				setLoading(false);
			}
		};
		init();
	}, []);

	useEffect(() => {
		if (currentConfName) {
			validGetters.current = getValidSignals('getter');
			validSetters.current = getValidSignals('setter');
			console.debug('current valid getters', validGetters.current);
			resetPolling();
			reinit();
		}
	}, [currentConfName, CPs]);
	const CPlogger = (msg, typ) => writeLog(msg, typ, 'panel', currentConfName);

	if (loading)
		return (
			<Wrapper className={className}>
				<CPload />
			</Wrapper>
		);
	if (initError)
		return (
			<Wrapper className={className}>
				Ошибка загрузки панелей управления:{' '}
				{initError?.message ?? 'неизвестная ошибка'}
			</Wrapper>
		);
	return (
		<Wrapper className={className}>
			<div className="flex flex-row">
				<UploadCPbutton envName={envName} initCPs={initCPs} />
				<ChooseCP
					currentConfName={currentConfName}
					onChange={e => setCurrentConfName(e.target.value)}
					cps={Object.keys(CPs)}
				></ChooseCP>
			</div>
			<StyledGrid
				style={CPs?.[currentConfName]?.style}
				currentGetterStates={getterStates[currentConfName]}
				envName={envName}
				schemeOn={schemeOn}
				writeLog={CPlogger}
			>
				{loadingTable || setterIniting ? (
					<CPload />
				) : CPs?.[currentConfName]?.content ? (
					CPs[currentConfName].content.map((elem, index) =>
						elem.type == 'setter' ? (
							<CPset
								specs={elem}
								style={elem.style}
								envName={envName}
								key={index}
								haveInit={setterInit}
								setHaveInit={setsetterInit}
								schemeOn={schemeOn}
								writeLog={writeLog}
							></CPset>
						) : (
							<CPget
								specs={elem}
								style={elem.style}
								onTable={getterStates}
								schemeOn={schemeOn}
								key={index}
								writeLog={writeLog}
							></CPget>
						)
					)
				) : (
					''
				)}
			</StyledGrid>
		</Wrapper>
	);
}
export default CPview;
