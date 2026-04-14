import styles from './addFromFileForm.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import React, { useState } from 'react';
import OpenLocalFileModal from './openLocalFileModal';
import { getList } from '@/lib/api_wrap/configAPI';
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
	const translateEntry = entry => {
		const dictionary = {
			Имя: 'name',
			COM_порт: 'comPort',
			Описание: 'description',
			Адрес: 'address',
			Число_входных_портов: 'maxInputs',
			Число_выходов: 'maxOutputs',
			Версия_протокола: 'protocolVersion',
			Группа: 'parentGroup',
			Плата: 'testBoard',
			Канал: 'channel',
			Сигнал_исходящий: 'isOutput',
			Сигнал_инвертированный: 'isStraight',
			Имя_активного_состояния: 'turnedOnStatusName',
			Имя_неактивного_состояния: 'turnedOffStatusName',
			СУЛ: 'parentSul',
			Сдвиг_в_байтах: 'byteShift',
			Первый_бит: 'firstBit',
			Последний_бит: 'lastBit',
		};
		console.log('entry in translateEntry', entry);
		const res = Object.keys(entry).reduce((acc, key) => {
			try {
				const val =
					key == 'Сигнал_исходящий'
						? entry[key] == 'да'
							? true
							: false
						: key == 'Сигнал_инвертированный'
							? entry[key] == 'да'
								? false
								: true
							: entry[key];
				return { ...acc, [dictionary[key]]: val };
			} catch (err) {
				setReaderError(err);
				return acc;
			}
		}, {});
		return res;
	};
	// className={styles.asideButtons} for aside when buttons
	const uploadAction = (e, file) => {
		if (!file) return;

		const reader = new FileReader();

		reader.onload = e => {
			const process = async content => {
				console.dir(content);
				let report;
				if (table != null) {
					const newContent = content.map(translateEntry);
					report = await multiplePostPatch(newContent, table, defaultScheme);
				} else {
					if ('env' in content) {
						report = {
							Рабочее_пространство: await multiplePostPatch(
								content.env.$,
								'Scheme'
							),
						};
						const schemes = await getList('Scheme');
						console.log('schemes after post', schemes);
						const scheme = schemes.find(item => {
							return item.name == content.env.$.name;
						});
						console.log('scheme', scheme);
						const sulPost = await multiplePostPatch(
							content.env.sul[0].$,
							'Sul',
							scheme
						);
						report.СУЛ = sulPost;
						const tbPost = await multiplePostPatch(
							content.env.testBoards[0].testBoard.map(item => item.$),
							'TestBoard',
							scheme
						);
						report.Тестовые_платы = tbPost;
						const groupPost = await multiplePostPatch(
							content.env.groups[0].group.map(item => item.$),
							'GroupOfSignals',
							scheme
						);
						report.Группы = groupPost;
						const sigPost = await multiplePostPatch(
							content.env.testSignals[0].signal.map(item => item.$),
							'Signal',
							scheme
						);
						report.Сигналы_тестовых_плат = sigPost;
						const sulSigPost = await multiplePostPatch(
							content.env.sulSignals[0].sulSignal.map(item => item.$),
							'SulSignal',
							scheme
						);
						report.Сигналы_СУЛ = sulSigPost;
					} else
						throw new Error(
							'В файле отсутствует поле "Рабочее_пространство" или при его заполнении допущена ошибка'
						);
				}
				console.log('report', report);
				setParseReport(report);
				setReaderError(null);
			};
			try {
				parseString(e.target.result, (err, result) => process(result));
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
