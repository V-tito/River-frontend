import React, { useState } from 'react';
import styles from './editor.module.css';
import PropTypes from 'prop-types';
const JsonEdit = ({ setFormData }) => {
	const [textData, setTextData] = useState();
	const handleEditorChange = e => {
		setFormData(JSON.parse(e.target.value));
		setTextData(e.target.value);
	};
	return (
		<textarea
			className={styles.editor}
			value={textData}
			onChange={handleEditorChange}
			placeholder={`Введите список команд в формате JSON: 
[{
"action": "check" / "wait" / "set" / "setPulse" / "preset" / "presetPulse" / "executePresets",
"signal": "Имя_сигнала",
"targetValue"(или "expectedValue" для check и wait): "true" / "false"
//только если action - "setPulse" или "presetPulse":
"pulseTime": целое число - время в миллисекундах,
"period": целое число - время в миллисекундах //0 если нужен однократный импульс
},...]`}
		/>
	);
};

JsonEdit.propTypes = { setFormData: PropTypes.func };
export default JsonEdit;
