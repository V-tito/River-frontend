import React, {
	useEffect,
	useState,
	useCallback,
	useMemo,
	useRef,
} from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import CPgrid from './CPgrid';
import ChooseCP from '../chooseCP';
import { useGlobal } from '@/app/GlobalState';
import { useCPManager } from '../../../utils/hooks/useCPmanager/useCPmanager';
import { fetchAllStates } from '../../../utils/api_wrap/dataProcessingHelpers/getStateHelpers';
import CPload from './CPload';
//func for validating current cp
function CPview({ schemeName, writeLog, className = '' }) {
	const { setPollingError, schemeOn } = useGlobal();
	const { currentConfName, setCurrentConfName, CPs, initCPs } =
		useCPManager(schemeName);
	const [getterStates, setGetterStates] = useState({});

	const responseWaiting = useRef(false);
	const setResponseWaiting = val => {
		responseWaiting.current = val;
	};
	const validGetters = useRef([]);
	const intervalId = useRef();
	const [loading, setLoading] = useState(true);
	const onRef = useRef(schemeOn);
	useEffect(() => {
		onRef.current = schemeOn;
	});
	useEffect(() => {
		const init = async () => {
			setLoading(true);
			try {
				await initCPs();
			} catch (err) {
				console.debug('some err initing testing cps');
			}
		};
		init();
	}, []);
	const setCPsGetterStates = (CPname, updater) => {
		console.debug('setCPGS');
		setGetterStates(prev => {
			return {
				...prev,
				[CPname]: updater instanceof Function ? updater(prev[CPname]) : updater,
			};
		});
	};
	useEffect(() => {
		if (!loading) setLoading(true);
		console.debug('cps withing reduce', CPs);
		const newGS = Object.keys(CPs).reduce((acc, key) => {
			return {
				...acc,
				[key]: CPs[key].content.reduce((acc, item) => {
					return item.valid && item.type == 'getter'
						? { ...acc, [item.signal.name]: { on: -1, valid: false } }
						: acc;
				}, {}),
			};
		}, {});
		console.debug('new GS', newGS);
		setGetterStates(newGS);
		setLoading(false);
	}, [CPs]);
	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('pagehide', () => {
			clearInterval(intervalId);
		});
	}, []);
	useEffect(() => {
		if (!loading)
			if (currentConfName) {
				setLoading(true);
				validGetters.current = CPs[currentConfName].content
					.filter((elem, index) => {
						return elem.valid && elem.type == 'getter';
					})
					.map(elem => elem.signal);
				if (intervalId.current) clearInterval(intervalId);
				const setCurrentGetters = updater =>
					setCPsGetterStates(currentConfName, updater);
				const firstFetch = async () => {
					console.debug('first fetch');
					await fetchAllStates(
						schemeName,
						onRef,
						validGetters.current,
						setPollingError,
						responseWaiting,
						setResponseWaiting,
						setCurrentGetters
					);
					console.debug('loading false');
					setLoading(false);
				};
				firstFetch();
				intervalId.current = setInterval(
					fetchAllStates,
					1000,
					schemeName,
					onRef,
					validGetters.current,
					setPollingError,
					responseWaiting,
					setResponseWaiting,
					setCurrentGetters
				);
			}
	}, [currentConfName, CPs]);
	useEffect(() => {
		console.debug('gs', getterStates);
	}, [getterStates]);
	const CPlogger = (msg, typ) => writeLog(msg, typ, 'panel', currentConfName);
	return (
		<div className={className}>
			<label className={headerStyles.modalHeader}>Панель управления</label>
			<ChooseCP
				schemeName={schemeName}
				currentConfName={currentConfName}
				onChange={e => setCurrentConfName(e.target.value)}
				cps={Object.keys(CPs)}
			></ChooseCP>
			{loading ? (
				<CPload />
			) : (
				<CPgrid
					elems={CPs[currentConfName]?.content ?? []}
					currentGetterStates={getterStates[currentConfName]}
					schemeName={schemeName}
					schemeOn={schemeOn}
					writeLog={CPlogger}
				></CPgrid>
			)}
		</div>
	);
}
export default CPview;
