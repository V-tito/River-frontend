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
import { DragDropProvider } from '@dnd-kit/react';
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
function DraggableElem({
	index,
	setSpecs,
	item,
	data,
	groups,
	remove,
	parent,
}) {
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
	console.debug(
		'made draggable with ref',
		ref,
		'from item',
		item,
		'which is dragging?',
		isDragging
	);
	const parentRect = parent.current
		? parent.current?.getBoundingClientRect()
		: null;
	console.debug('parent in draggable elem', parent);
	console.debug('parent bounds in draggable elem', parentRect);
	let x = item?.position?.x,
		y = item?.position?.y;
	console.debug('in draggable elem, x', x, 'y', y);
	if (parentRect) {
		const { left, right, top, bottom, width, height } = parentRect;
		console.debug(y && height, y < height, top < y, y < bottom);
		console.debug(x && width, left < x && x < right, left < x, x < right);
		y = y && height ? (y < height ? (y > 0 ? y : 0) : height) : '';
		x = x && width ? (x < width ? (x > 0 ? x : 0) : '') : '';
	}
	return (
		<div
			style={{
				position: 'absolute',
				top: isDragging ? undefined : y,
				left: isDragging ? undefined : x,
			}}
			ref={ref}
		>
			<EditCPelem
				index={index}
				specs={item}
				setSpecs={setSpecs}
				groups={groups}
				data={data}
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
	const panelRef = useRef();
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
						console.debug('event', event);
						const { source, target, position, transform, shape } =
							event.operation;
						//if (!target) return;

						const { type, data } = source;
						console.debug('source data', data);
						const refsize = panelRef.current?.getBoundingClientRect();
						console.debug(
							'refsize',
							refsize,
							'shape.current.boundingRectangle',
							shape.current.boundingRectangle
						);
						const pos = data.position
							? {
									x: data.position.x + transform.x,
									y: data.position.y + transform.y,
								}
							: {
									x: shape.current.left - (refsize.left ?? 0),
									y: shape.current.top - (refsize.top ?? 0),
								};
						if (refsize) {
							if (
								pos.x >
								refsize.right -
									refsize.left -
									shape.current.boundingRectangle.width
							)
								pos.x =
									refsize.right -
									refsize.left -
									shape.current.boundingRectangle.width;
							if (
								pos.y >
								refsize.bottom -
									refsize.top -
									shape.current.boundingRectangle.height
							)
								pos.y =
									refsize.bottom -
									refsize.top -
									shape.current.boundingRectangle.height;
							if (pos.x < 0) pos.x = 0;
							if (pos.y < 0) pos.y = 0;
						}
						console.debug('pos in drag event', pos);
						console.debug('type', type, "type == 'addmenu'", type == 'addmenu');
						if (type == 'addmenu') {
							//event.preventDefault();
							let i = CPs[currentConfName].length;
							console.debug('i in drag event', i);
							insertEntry(i, { ...data, position: pos });
							setVersion(prev => prev + 1);
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
					<div className="flex flex-col w-full">
						<div ref={panelRef} className="flex flex-col w-min">
							<StyledGrid
								style={CPs[currentConfName]?.style}
								noConf={!currentConfName}
								envName={envName}
							>
								{conf?.map((item, index) => (
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
										parent={panelRef}
									></DraggableElem>
								))}
							</StyledGrid>
						</div>
					</div>
					<div
						className="flex flex-col w-min"
						style={{ justifyContent: 'right', justifySelf: 'right' }}
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
