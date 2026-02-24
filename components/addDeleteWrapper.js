import AddForm from './forms/addForm';
import styles from './addDeleteWrapper.module.css';
import SetSulButtons from './setSulButtons';
import commonStyles from './common.module.css';
import React, { useEffect, useState } from 'react';
import OpenLocalFileModal from './modals/openLocalFileModal';
import { multiplePostPatch } from '@/lib/hooks/postPatchHelpers';
import SaveFromVarLocally from '@/components/modals/saveFromVarLocally';
import PropTypes from 'prop-types';
import { useGlobal } from '@/app/GlobalState';
const AddDeleteWrapper = ({ table, children }) => {
	const { defaultScheme } = useGlobal();
	const [sul, setSul] = useState(false);
	const [type, setType] = useState(table);
	const [parseReport, setParseReport] = useState(null);
	const [readerError, setReaderError] = useState();
	useEffect(() => {
		if (sul) {
			if (table == 'Signal') setType('SulSignal');
			if (table == 'TestBoard') setType('Sul');
		}
		if (!sul) {
			if (table == 'Signal') setType('Signal');
			if (table == 'TestBoard') setType('TestBoard');
		}
	}, [sul]);
	// className={styles.asideButtons} for aside when buttons
	return (
		<div className={styles.wrap}>
			<div className={styles.main}>{children}</div>
			<aside className={styles.asideForms}>
				<SetSulButtons table={table} sul={sul} setSul={setSul}></SetSulButtons>
				<AddForm table={type}></AddForm>
				<div className={commonStyles.buttons}>
					<OpenLocalFileModal
						uploadAction={(e, file) => {
							if (!file) return;

							const reader = new FileReader();

							reader.onload = e => {
								const process = async e => {
									const content = e.target.result;
									console.log(content);
									const report = await multiplePostPatch(
										JSON.parse(content),
										type,
										defaultScheme
									);
									console.log('report', report);
									setParseReport(report);
									setReaderError(null);
								};
								try {
									process(e);
								} catch (err) {
									setReaderError(err);
									console.log('invalid json');
									setParseReport(null);
								}
							};

							reader.onerror = () => {
								setReaderError(new Error('Не удалось прочитать файл'));
							};

							reader.readAsText(file);
						}}
						label={'Создать из файла'}
						uploadError={readerError}
					></OpenLocalFileModal>
				</div>
				{parseReport ? (
					<div className="flex flex-col">
						<div className={styles.report}>
							{Object.entries(parseReport).map(entry => (
								<span>
									{entry[0]}: {entry[1]}
								</span>
							))}
						</div>
						<SaveFromVarLocally
							formData={parseReport}
							initName="report.json"
							scheme={defaultScheme.name}
						></SaveFromVarLocally>
					</div>
				) : (
					''
				)}
			</aside>
		</div>
	);
};
AddDeleteWrapper.propTypes = {
	table: PropTypes.string.isRequired,
	listOfAll: PropTypes.arrayOf(PropTypes.shape({})),
	children: PropTypes.node,
};

export default AddDeleteWrapper;
//bebebebababa
//thank fuck
