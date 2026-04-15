import styles from './addFromFileForm.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import React, { useState } from 'react';
import OpenLocalFileModal from './openLocalFileModal';
import {
	getList,
	checkExistence,
	deleteEntity,
} from '@/lib/api_wrap/configAPI';
import { multiplePostPatch } from '@/lib/hooks/postPatchHelpers';
import SaveFromVarLocally from '@/components/modals/saveFromVarLocally';
import PropTypes from 'prop-types';
import { useGlobal } from '@/app/GlobalState';
import { parseString } from 'xml2js';
const addFromFileForm = ({
	table = null,
	buttonLabel = 'Создать из файла',
}) => {
	const { defaultScheme } = useGlobal();
	const [parseReport, setParseReport] = useState(null);
	const [readerError, setReaderError] = useState();
	const dict = {
		TestBoards: 'Тестовые_платы',
		Groups: 'Группы',
		TestSignals: 'Сигналы_тестовых_плат',
		SulSignals: 'Сигналы_СУЛ',
	};
	const keys = Object.keys(dict);
	// className={styles.asideButtons} for aside when buttons
	const uploadAction = (e, file) => {
		if (!file) return;

		const reader = new FileReader();

		reader.onload = e => {
			const validateContent = content => {
				if (typeof content == 'object') {
					if (content != null) {
						if ('Env' in content) {
							if (!('Sul' in content.Env)) {
								content.Env.Sul = '';
							}
							keys.map(item => {
								if (!(item in content.Env)) {
									content.Env.item = [''];
								}
							});
							return content;
						} else throw new Error('Отсутствует тег рабочего пространства');
					} else throw new Error('Файл пуст');
				} else throw new Error('Ошибка чтения файла');
			};
			const processHeader = async (header, scheme) => {
				if (Array.isArray(header)) {
					if (typeof header[0] == 'object') {
						console.log(
							'typeof is obj',
							typeof header[0],
							typeof header[0] == 'object'
						);
						const key = Object.keys(header[0])[0];
						const post = await multiplePostPatch(
							header[0][key].map(item => item.$),
							key,
							scheme
						);
						return post;
					} else {
						return { posted: 0, patched: 0 };
					}
				}
			};
			const process = async content => {
				try {
					console.dir(content);
					let report;
					if (table != null) {
						const newContent = content.map(translateEntry);
						report = await multiplePostPatch(newContent, table, defaultScheme);
					} else {
						console.log('content', content);
						const newContent = validateContent(content);
						const exists = await checkExistence(
							'Scheme',
							newContent.Env.$.name
						);
						if (exists) {
							await deleteEntity('Scheme', newContent.Env.$.name);
						}
						report = {
							Рабочее_пространство: await multiplePostPatch(
								newContent.Env.$,
								'Scheme'
							),
						};
						const schemes = await getList('Scheme');
						console.log('schemes after post', schemes);
						const scheme = schemes.find(item => {
							return item.name == content.Env.$.name;
						});
						console.log('scheme', scheme);
						if (content.Env.Sul[0] != '') {
							console.log('sulparse', content.Env.Sul[0]);
							const sulPost = await multiplePostPatch(
								content.Env.Sul[0].$,
								'Sul',
								scheme
							);
							report.СУЛ = sulPost;
						} else {
							report.СУЛ = { posted: 0, patched: 0 };
						}
						for (let i = 0; i < keys.length; i++) {
							const key = keys[i];
							report[dict[key]] = await processHeader(content.Env[key], scheme);
						}
					}
					console.log('report', report);
					setParseReport(report);
					setReaderError(null);
				} catch (err) {
					setReaderError(err);
					console.log('invalid xml');
					setParseReport(null);
				}
			};
			try {
				parseString(e.target.result, (err, result) => {
					process(result);
				});
			} catch (err) {
				setReaderError(err);
				console.log('invalid xml');
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
				label={buttonLabel}
				uploadError={readerError}
				closeAfter={false}
				reloadOnClose={true}
				accept=".xml"
			>
				{parseReport ? (
					<div className="flex flex-col w-full">
						<p className={headerStyles.modalHeader}>Отчет о загрузке</p>
						<div className={styles.report}>
							{Object.entries(parseReport).map(entry => {
								{
									return table == null ? (
										<span key={entry}>
											<h2 className={headerStyles.modalHeader}>{entry[0]}:</h2>
											{Object.entries(entry[1]).map(subEntry => (
												<p key={subEntry}>
													{subEntry[0]}: {subEntry[1]}
												</p>
											))}
										</span>
									) : (
										<span key={entry}>
											{entry[0]}: {entry[1]}
										</span>
									);
								}
							})}
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
