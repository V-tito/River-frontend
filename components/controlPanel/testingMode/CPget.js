import icons from '../icons';
import StyledIcon from './styledIcon';
/**
 * generates CP get selement for panel in test mode only (for the time being)
 * @param {*} param0 has two fields. the first is specs, a record with fields "signal" and "icon", corresponding to signal (minimal signal interface, see:hooks) and icon type ("trigger"/"lamp"). The second is on, a state variable (or a field in a state variable) keeping the state of corresponding signal, fetched from backend (data gathering lifted up for performance)
 */
function CPget({ specs, onTable, schemeOn }) {
	console.debug('mounted getter with specs', specs, 'onTable', onTable);
	const { signal, icon, valid, position } = specs;
	const { name } = signal;
	let on = -1,
		error = false;
	const disabled = !valid || !schemeOn;
	console.debug('getter', specs, 'isValid', valid);
	if (valid) {
		console.debug('name', name, 'onTable', onTable);
		on = onTable?.[name]?.on;
		error = onTable?.[name]?.valid;
	}
	const icon_ = icons.getter[icon];
	return (
		<StyledIcon
			icon_={icon_}
			on={on}
			error={error}
			signal={signal}
			position={position}
			disabled={disabled}
		/>
	);
}

export default CPget;
