import { checkExistence } from '@/utils/api_wrap/configAPI';
import { isExtEntry } from '@/utils/interfaces/CPtypes';

import { baseMode } from './baseMode';

export function testingMode(envName: string) {
	const {
		currentConfName,
		setCurrentConfName,
		CPs,
		setCPs,
		loadCurrentFromSessionStorage,
		getInitialCPs,
		init,
		setInit,
	} = baseMode(envName, 'tester');
	const initCPs = async () => {
		if (!init) {
			const newCPs = await getInitialCPs();
			try {
				for (const name of Object.keys(newCPs))
					if (newCPs[name]) {
						const content = newCPs[name].content;
						const sigsValidityPromise = content.map(async elem => {
							try {
								console.debug('checking validity with elem', elem);
								const valid = await checkExistence(
									'Signal',
									elem.signal.name,
									elem.signal.parentGroup,
									envName
								);

								return { ...elem, valid: valid };
							} catch (err) {
								return { ...elem, valid: false };
							}
						});
						const sigsValidity = await Promise.all(sigsValidityPromise);
						console.debug('validity map fetched', sigsValidity);
						newCPs[name].content = sigsValidity;
					}
			} catch (err) {
				console.debug(err);
			} finally {
				console.debug('settingCPs', newCPs);
				setCPs(newCPs);
				loadCurrentFromSessionStorage();
				setInit(true);
			}
		}
	};
	const getValidSignals = (
		typ: 'setter' | 'getter',
		confname: string | undefined = currentConfName
	) => {
		if (confname == undefined) return [];
		if (!CPs[confname]) return [];
		CPs[confname].content
			.filter((elem, index) => {
				if (isExtEntry(elem)) return elem.valid && elem.type == typ;
			})
			.map(elem => elem.signal);
	};
	return {
		currentConfName,
		setCurrentConfName,
		CPs,
		initCPs,
		getValidSignals,
	};
}
