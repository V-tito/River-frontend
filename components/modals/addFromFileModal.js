import styles from './addFromFileForm.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import React, { useState } from 'react';
import OpenLocalFileModal from './openLocalFileModal';
import { getList } from '@/lib/api_wrap/configAPI';
import { multiplePostPatch } from '@/lib/hooks/postPatchHelpers';
import SaveFromVarLocally from '@/components/modals/saveFromVarLocally';
import PropTypes from 'prop-types';
import { useGlobal } from '@/app/GlobalState';
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
			const process = async e => {
				const content = JSON.parse(e.target.result);
				console.log(content);
				let report;
				if (table != null) {
					const newContent = content.map(translateEntry);
					report = await multiplePostPatch(newContent, table, defaultScheme);
				} else {
					if ('Рабочее_пространство' in content) {
						report = {
							Рабочее_пространство: await multiplePostPatch(
								translateEntry(content.Рабочее_пространство),
								'Scheme'
							),
						};
						const schemes = await getList('Scheme');
						console.log('schemes after post', schemes);
						const scheme = schemes.find(item => {
							console.log('item', item);
							console.log(content.Рабочее_пространство);
							console.log(content.Рабочее_пространство.Имя);
							return item.name == content.Рабочее_пространство.Имя;
						});
						console.log('scheme', scheme);
						const sulPost = await multiplePostPatch(
							translateEntry(content.СУЛ),
							'Sul',
							scheme
						);
						report.СУЛ = sulPost;
						const tbPost = await multiplePostPatch(
							content.Тестовые_платы.map(translateEntry),
							'TestBoard',
							scheme
						);
						report.Тестовые_платы = tbPost;
						const groupPost = await multiplePostPatch(
							content.Группы.map(translateEntry),
							'GroupOfSignals',
							scheme
						);
						report.Группы = groupPost;
						const sigPost = await multiplePostPatch(
							content.Сигналы_тестовых_плат.map(translateEntry),
							'Signal',
							scheme
						);
						report.Сигналы_тестовых_плат = sigPost;
						const sulSigPost = await multiplePostPatch(
							content.Сигналы_СУЛ.map(translateEntry),
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
				label={buttonLabel}
				uploadError={readerError}
				closeAfter={false}
				reloadOnClose={true}
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
