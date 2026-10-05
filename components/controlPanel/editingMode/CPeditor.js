import React, { useEffect, useState, useCallback } from 'react';
import { useGlobal } from '@/app/GlobalState';
import EditCPgrid from './editCPgrid';
import AddElementMenu from './addElementMenu';
import ChooseCP from '../chooseCP';
import RenameCPmodal from './renameCPmodal';
import NewCPbutton from './newCPbutton';
import SaveButton from './saveButton';
import { Upload, Download } from '@deemlol/next-icons';
import { useCPManager } from '../CPmanager/CPmanager';
import DeleteButton from '@/components/fileManagement/delButton';
import ConfirmSave from './confirmSave';
import SaveFromVarLocally from '@/components/modals/saveFromVarLocally';
import { DragDropProvider } from '@dnd-kit/react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
export default function CPeditor({ schemeName, setPollingError }) {
	const [data, setData] = useState({});
	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);
	const [version, setVersion] = useState(0);
	const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
	const {
		currentConfName,
		setCurrentConfName,
		CPs,
		addCP,
		saveCPToSessionStorage,
		deleteCP,
		updateCPContent,
		initCPs,
		renameCurrentCP,
		insertEntry,
		removeEntry,
		alterEntryField,
		saveCP,
	} = useCPManager(schemeName);
	const [blank, setBlank] = useState();
	console.debug('blank', blank);
	useEffect(() => {
		setBlank(CPs[currentConfName]?.length);
	}, [currentConfName, CPs]);
	//fetch inputs and outputs
	useEffect(() => {
		const init = async () => {
			await initCPs();
			setLoading(false);
		};
		init();
	}, []);
	useEffect(() => {
		const fetchSignals = async () => {
			try {
				const response = await fetch(
					`/api/getSignalTables/${schemeName}?sortedSignals=true`
				);
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				setData(conf.data);
				setGroups(conf.groups);
			} catch (err) {
				if (err instanceof Error) {
					setPollingError(err);
				}
			}
			setLoading(false);
		};
		fetchSignals();
	}, [schemeName]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			saveCPToSessionStorage();
		}, 500); // Debounce 500ms

		return () => clearTimeout(timeoutId);
	}, [saveCPToSessionStorage]);

	if (loading) return <p>Загрузка</p>;
	return (
		<div>
			<ChooseCP
				schemeName={schemeName}
				currentCP={currentConfName}
				onChange={e => {
					setCurrentConfName(e.target.value);
				}}
				cps={Object.keys(CPs)}
			></ChooseCP>
			<RenameCPmodal CPname={currentConfName} rename={renameCurrentCP} />
			<SaveButton saveConf={saveCP} />
			<SaveFromVarLocally
				formData={CPs[currentConfName]}
				initName={currentConfName}
				label={<Upload />}
				title="Экспорт"
			/>
			<NewCPbutton add={addCP} />
			<DeleteButton
				filepath={`?folder=${schemeName}/CPs/&filename=${currentConfName}`}
			/>
			<DragDropProvider
				key={version}
				onDragEnd={event => {
					if (event.canceled) return;
					const { source, target } = event.operation;
					console.debug('source', source);
					const { type, data } = source;
					console.debug('type', type, "type == 'addmenu'", type == 'addmenu');
					if (type == 'addmenu') {
						//event.preventDefault();
						let i;
						if (target) {
							const { index } = target;
							i = index;
						} else {
							i = CPs[currentConfName].length;
						}
						console.debug('type', type);
						insertEntry(i, data);
					} else {
						const { initialIndex, index } = source;
						if (initialIndex !== index)
							updateCPContent(items => {
								const newData = [...items];
								const [removed] = newData.splice(initialIndex, 1);
								console.debug('removed', removed);
								return newData.toSpliced(index, 0, removed);
							});
						setVersion(prev => prev + 1);
					}
					setBlank(CPs[currentConfName].length);
				}}
				onDragOver={event => {
					if (event.canceled) return;
					const { source, target } = event.operation;
					if (!target) return;
					console.debug('source', source);
					const { type, data } = source;
					console.debug('type', type, "type == 'addmenu'", type == 'addmenu');
					if (type == 'addmenu') {
						//event.preventDefault();
						const { index } = target;
						console.debug('type', type);
						setBlank(index);
					}
				}}
			>
				<div className="flex flex-row">
					<EditCPgrid
						conf={CPs[currentConfName]}
						setField={alterEntryField}
						data={data}
						groups={groups}
						remove={removeEntry}
						blankIndex={blank}
					/>
					<AddElementMenu />
				</div>
			</DragDropProvider>
		</div>
	);
}
