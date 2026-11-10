'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import ConfirmFileDeleteModal from '@/components/modals/confirmFileDeleteModal';
import SaveFromVarLocally from '@/components/modals/saveFromVarLocally';
import { DragDropProvider, useDraggable } from '@dnd-kit/react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import EditCPelem from './editCPelem';
import StyledGrid from '../styledGrid';
function SortableElem({ index, setSpecs, item, data, groups, remove }) {
	const { ref } = useSortable({ id: item.id, index: index, group: 'panel' });
	return (
		<li ref={ref} className={styles.li}>
			<EditCPelem
				index={index}
				specs={item}
				setSpecs={setSpecs}
				groups={groups}
				data={data}
				remove={remove}
			/>
		</li>
	);
}
function DraggableElem({ index, setSpecs, item, data, groups, remove }) {
	const { ref, isDragging } = useDraggable({
		id: item.id,
		data: { index: index, group: 'panel' },
		plugins: [
			Feedback.configure({
				feedback: 'move',
				dropAnimation: null,
			}),
		],
	});
	return (
		<div
			style={{
				position: 'absolute',
				top: isDragging ? undefined : item?.style?.position?.y,
				left: isDragging ? undefined : item?.style?.position?.x,
			}}
			ref={ref}
		>
			<EditCPelem
				index={index}
				specs={item}
				setSpecs={setSpecs}
				groups={groups}
				data={data}
				style={item.style}
				remove={remove}
			/>
		</div>
	);
}
export default function CPeditor({ envName, setPollingError }) {
	const [data, setData] = useState({});
	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);
	const [version, setVersion] = useState(0);
	const {
		currentConfName,
		setCurrentConfName,
		CPs,
		addCP,
		getNewName,
		deleteCP,
		initCPs,
		renameCP,
		insertEntry,
		removeEntry,
		alterEntryField,
		saveCP,
		updateCPWidth,
		updateCPHeight,
		updateCPBackground,
	} = useCPManager(envName, 'editing');
	const containerRef = useRef();
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
					`/api/getSignalTables/${envName}?sortedSignals=true`
				);
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				const sulResponse = await fetch(
					`/api/getSulSignalTables/${envName}?sortedSignals=true`
				);
				const sulConf = await sulResponse.json();
				if (!sulResponse.ok) {
					throw new Error(`Ошибка сети ${sulResponse.status}`);
				}
				const dataWithSulInputs = conf.groups.reduce((acc, group) => {
					const groupContent = {
						inputs: [
							...conf.data[group.name].inputs,
							...sulConf.data[group.name].inputs,
						],
						outputs: conf.data[group.name].outputs,
					};
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
	}, [envName]);

	if (loading) return <p>Загрузка</p>;
	return (
		<div>
			<ChooseCP
				envName={envName}
				currentConfName={currentConfName}
				onChange={e => {
					setCurrentConfName(e.target.value);
				}}
				cps={Object.keys(CPs)}
				initCPs={initCPs}
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
			<ConfirmFileDeleteModal
				envName={envName}
				fileCategory="CPs"
				deleteFunc={() => deleteCP(currentConfName)}
				afterDel={initCPs}
			/>
			<div className="flex flex-row">
				<DragDropProvider
					key={version}
					plugins={[Feedback.configure({ dropAnimation: null })]}
					onDragEnd={event => {
						if (event.canceled) return;
						if (!currentConfName) return;
						const { source, transform, shape } = event.operation;
						const { type, data } = source;
						const refsize = containerRef?.current?.getBoundingClientRect();
						console.debug('refsize', refsize);
						const initPos = data?.style?.position;
						const pos = initPos
							? {
									x: initPos.x + transform.x,
									y: initPos.y + transform.y,
								}
							: {
									x: shape.current.left - (refsize?.left ?? 0),
									y: shape.current.top - (refsize?.top ?? 0),
								};
						if (type == 'addmenu') {
							let i = CPs[currentConfName].length;
							insertEntry(i, {
								...data,
								style: { ...data.style, position: pos },
							}); //TODOvalidate style in insert entry
							setVersion(prev => prev + 1);
						} else {
							if (data.index != undefined) {
								alterEntryField(data.index, 'position', pos);
							}
						}
					}}
				>
					<div className="flex w-full" ref={containerRef}>
						<StyledGrid
							style={CPs[currentConfName]?.style}
							noConf={!currentConfName}
							envName={envName}
						>
							{CPs[currentConfName]?.content?.map((item, index) => (
								<DraggableElem
									index={index}
									setSpecs={(fieldName, val) => {
										alterEntryField(index, fieldName, val);
									}}
									key={index}
									item={item}
									data={data}
									groups={groups}
									remove={() => {
										removeEntry(index);
									}}
								></DraggableElem>
							))}
						</StyledGrid>
					</div>
					<div
						className="flex flex-col"
						style={{
							placeContent: 'right',
							placeSelf: 'right',
							width: 'min-content',
						}}
					>
						<AddElementMenu />
						<SetCPSize
							x={CPs[currentConfName]?.style?.width}
							y={CPs[currentConfName]?.style?.height}
							setX={updateCPWidth}
							setY={updateCPHeight}
							cp={currentConfName}
						/>
						<SetCPBackground
							currentBack={CPs[currentConfName]?.style?.background}
							setBack={updateCPBackground}
							envName={envName}
						/>
					</div>
				</DragDropProvider>
			</div>
		</div>
	);
}
