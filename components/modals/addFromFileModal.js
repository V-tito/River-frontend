import styles from './addFromFileForm.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import React, { useState } from 'react';
import OpenLocalFileModal from './openLocalFileModal';
import { multiplePostPatch } from '@/lib/hooks/postPatchHelpers';
import SaveFromVarLocally from '@/components/modals/saveFromVarLocally';
import PropTypes from 'prop-types';
import { useGlobal } from '@/app/GlobalState';
const addFromFileForm = ({ table }) => {
	const { defaultScheme } = useGlobal();
	const [parseReport, setParseReport] = useState(null);
	const [readerError, setReaderError] = useState();
	// className={styles.asideButtons} for aside when buttons
	const uploadAction = (e, file) => {
		if (!file) return;

		const reader = new FileReader();

		reader.onload = e => {
			const process = async e => {
				const content = e.target.result;
				console.log(content);
				const report = await multiplePostPatch(
					JSON.parse(content),
					table,
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
	};
	return (
		<div>
			<OpenLocalFileModal
				uploadAction={(e, file) => uploadAction(e, file)}
				label={'Создать из файла'}
				uploadError={readerError}
				closeAfter={false}
				reloadOnClose={true}
			>
				{parseReport ? (
					<div className="flex flex-col w-full">
						<p className={headerStyles.modalHeader}>Отчет о загрузке</p>
						<div className={styles.report}>
							{Object.entries(parseReport).map(entry => (
								<span key={entry}>
									{entry[0]}: {entry[1]}
								</span>
							))}
						</div>
						<SaveFromVarLocally
							formData={parseReport}
							initName="report.json"
							scheme={defaultScheme.name}
							label="Сохранить отчет"
						></SaveFromVarLocally>
					</div>
				) : (
					''
				)}
			</OpenLocalFileModal>
		</div>
	);
};
addFromFileForm.propTypes = {
	table: PropTypes.string.isRequired,
	listOfAll: PropTypes.arrayOf(PropTypes.shape({})),
	children: PropTypes.node,
};

export default addFromFileForm;
//bebebebababa
//thank fuck
