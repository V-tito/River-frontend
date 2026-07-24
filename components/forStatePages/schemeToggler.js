import styles from '@/components/forStatePages/schemeToggler.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import { toggleScheme } from '@/utils/api_wrap/protocol';
import { useGlobal } from '@/app/GlobalState';
import StateIndicator from './stateIndicator';

const SchemeToggler = () => {
	const { defaultScheme, schemeOn, setSchemeOn } = useGlobal();
	const controlStyle = `${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`;
	return (
		<div className={`${styles.schemeControls}`}>
			<button
				label={'Включить опрос'}
				onClick={async e => {
					await toggleScheme(defaultScheme.name);
					setSchemeOn(true);
				}}
				className={controlStyle}
			>
				{'Включить опрос'}
			</button>
			<button
				label={'Выключить опрос'}
				onClick={async e => {
					await toggleScheme(defaultScheme.name, false);
					setSchemeOn(false);
				}}
				className={controlStyle}
			>
				{'Выключить опрос'}
			</button>
			<StateIndicator
				on={schemeOn}
				turnedOnStatusName={'Опрос запущен'}
				turnedOffStatusName={'Опрос отключен'}
				unknownStatusName={'Cостояние опроса неизвестно'}
			></StateIndicator>
		</div>
	);
};
export default SchemeToggler;
