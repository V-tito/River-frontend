'use client';
//lib tools
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBeforeUnload } from 'react-use';
//styles
import styles from './editor.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
//hooks
import { usePersistentData } from '@/utils/hooks/usePersistentData';
//components
import FileManager from './fileManagerForEditor';

//manages whichever editor + results pair is active and provides shared context
const EditorWindow = ({ scheme }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const params = useSearchParams();
	const { saveOpenIds, loadOpenIds } = usePersistentData({
		storageKey: 'editor-contents',
		storageType: 'session',
	});
	const [openIds, setOpenIds] = useState(new Set());
	const [names, setNames] = useState([]);
	const [paths, setPaths] = useState({});
	const [currentId, setCurrentId] = useState(0);
	const router = useRouter();
	function getId() {
		let num = 0;
		while (openIds.has(num)) num++;
		return num;
	}
	useEffect(() => {
		//saved is array of {id,name} structs
		const savedIdNames = loadOpenIds();
		if (savedIds) {
			setNames(prev => {
				return [...prev, ...savedIdNames];
			});
			setOpenIds(prev => {
				return new Set([...prev, ...savedIdNames.map(item => item.id)]);
			});
		}
		let filepath = params.get('filepath');
		if (filepath) {
			if (Array.isArray(filepath))
				filepath.map(fpath => {
					let id = getId(openIds);
					setNames(prev => {
						const split = fpath.split('/');
						return [...prev, { id: id, name: split[split.length - 1] }];
					});
					setOpenIds(prev => {
						return new Set([...prev, id]);
					});
					setPaths(prev => {
						return { [id]: fpath };
					});
				});
			else {
				let id = getId(openIds);
				setNames(prev => {
					const split = filepath.split('/');
					return [...prev, { id: id, name: split[split.length - 1] }];
				});
				setOpenIds(prev => {
					return new Set([...prev, id]);
				});
				setPaths(prev => {
					return { [id]: filepath };
				});
			}
		}
		if (openIds.size === 0) {
			setOpenIds(new Set([0]));
			setIdToFnames([{ id: 0, name: 'unsaved' }]);
		}
		setLoading(false);
	}, []);
	//saving state
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			saveOpenIds(idToFnames);
		}, 500); // Debounce 500ms

		return () => clearTimeout(timeoutId);
	}, [idToFnames, saveOpenIds]);
	// Save before page unload
	useBeforeUnload(() => {
		saveOpenIds(idToFnames);
	}, true);
	useEffect(() => {
		const handleRouteChange = () => {
			saveOpenIds(idToFnames);
		};
		router.events?.on('routeChangeStart', handleRouteChange);
		return () => {
			router.events?.off('routeChangeStart', handleRouteChange);
		};
	}, [idToFnames, router, saveOpenIds]);

	return (
		<div>
			{idToFnames.map(item => (
				<EditAndResultsWindowPair
					scheme={scheme}
					id={item.id}
					fpath={paths[item.id]}
					currentId={currentId}
				></EditAndResultsWindowPair>
			))}
			<Modal state={error}>{error ? error.message : ''}</Modal>
			<FileManager
				formData={formData}
				setFormData={setFormData}
				initName={filename}
				scheme={scheme.name}
			></FileManager>
		</div>
	);
};
export default EditorWindow;
