'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useGlobal } from '@/app/GlobalState';
import { Feedback } from '@dnd-kit/dom';
import EditCPgrid from './editCPgrid';
import AddElementMenu from './addElementMenu';
import ChooseCP from '../chooseCP';
import RenameCPmodal from './renameCPmodal';
import NewCPbutton from './newCPbutton';
import SaveButton from './saveButton';
import SetCPSize from './setCPSize';
import SetCPBackground from './setCPBackground';
import { Upload, Download } from '@deemlol/next-icons';
import { useCPManager } from '../../../utils/hooks/useCPmanager/useCPmanager';
import ConfirmFileDeleteModal from '../modals/confirmFileDeleteModal';
import SaveFromVarLocally from '@/components/modals/saveFromVarLocally';
import { DragDropProvider } from '@dnd-kit/react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
export default function CPeditor({ schemeName, setPollingError }) {
	const [data, setData] = useState({});
	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);
	const panelRef = useRef();
	const {
		currentConfName,
		setCurrentConfName,
		CPs,
		addCP,
		getNewName,
		saveCurrentToSessionStorage,
		deleteCP,
		updateCPContent,
		initCPs,
		renameCP,
		insertEntry,
		removeEntry,
		alterEntryField,
		saveCP,
		updateCPWidth,
		updateCPHeight,
		updateCPBackground,
	} = useCPManager(schemeName, 'editing');
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
				const sulResponse = await fetch(
					`/api/getSulSignalTables/${schemeName}?sortedSignals=true`
				);
				const sulConf = await sulResponse.json();
				if (!sulResponse.ok) {
					throw new Error(`Ошибка сети ${sulResponse.status}`);
				}
				console.debug('conf', conf, 'sulconf', sulConf, 'groups', conf.groups);
				const dataWithSulInputs = conf.groups.reduce((acc, group) => {
					const groupContent = {
						inputs: [
							...conf.data[group.name].inputs,
							...sulConf.data[group.name].inputs,
						],
						outputs: conf.data[group.name].outputs,
					};
					console.debug(
						'group content',
						groupContent,
						'for group',
						group,
						'while acc is',
						acc
					);
					return {
						...acc,
						[group.name]: groupContent,
					};
				}, {});
				setData(dataWithSulInputs);
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

	if (loading) return <p>Загрузка</p>;
	return (
		<div>
			<ChooseCP
				schemeName={schemeName}
				currentConfName={currentConfName}
				onChange={e => {
					setCurrentConfName(e.target.value);
				}}
				cps={Object.keys(CPs)}
			></ChooseCP>
			<RenameCPmodal CPname={currentConfName} rename={renameCP} />
			<SaveButton saveConf={saveCP} />
			<SaveFromVarLocally
				formData={CPs[currentConfName]}
				initName={currentConfName}
				label={<Upload />}
				title="Экспорт"
			/>
			<NewCPbutton add={addCP} getname={getNewName} />
			<ConfirmFileDeleteModal envName={schemeName} fileCategory="CPs" />
			<div className="flex flex-row">
				<DragDropProvider
					plugins={[Feedback.configure({ dropAnimation: null })]}
					onDragEnd={event => {
						if (event.canceled) return;
						if (!currentConfName) return;
						console.debug('event', event);
						const { source, target, position, transform, shape } =
							event.operation;
						//if (!target) return;

						const { type, data } = source;
						console.debug('source data', data);
						const pos = data.position
							? {
									x: data.position.x + transform.x,
									y: data.position.y + transform.y,
								}
							: {
									x: shape.current.left - (panelRef.current?.offsetLeft ?? 0),
									y: shape.current.top - (panelRef.current?.offsetTop ?? 0),
								};
						console.debug('type', type, "type == 'addmenu'", type == 'addmenu');
						if (type == 'addmenu') {
							//event.preventDefault();
							let i = CPs[currentConfName].length;
							console.debug('type', type);
							insertEntry(i, { ...data, position: pos });
						} else {
							console.debug('enter alter');
							if (data.index != undefined) {
								console.debug('enter alter 2');
								alterEntryField(data.index, 'position', pos);
							}
						}
					}}
					onDragOver={({ operation }) => {
						const { source, target } = operation;
						console.log(`${source.id} is over ${target?.id}`);
					}}
				>
					<div className="flex flex-col w-full" ref={panelRef}>
						<EditCPgrid
							conf={CPs[currentConfName]?.content}
							style={CPs[currentConfName]?.style}
							setField={alterEntryField}
							data={data}
							groups={groups}
							remove={removeEntry}
							noConf={!currentConfName}
						/>
					</div>
					<div className="flex flex-col">
						<AddElementMenu />
						<SetCPSize
							x={CPs[currentConfName]?.style?.width}
							y={CPs[currentConfName]?.style?.height}
							setX={updateCPWidth}
							setY={updateCPHeight}
						/>
						<SetCPBackground
							currentBack={CPs[currentConfName]?.style?.background}
							setBack={updateCPBackground}
							envName={schemeName}
						/>
					</div>
				</DragDropProvider>
			</div>
		</div>
	);
}
