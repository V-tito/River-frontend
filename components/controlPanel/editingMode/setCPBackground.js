import { useState, useEffect } from 'react';
import { netError } from '@/utils/api_wrap/netError';
import { Loader } from '@deemlol/next-icons';
import { FileMosaic, FileInputButton } from '@files-ui/react';
import Image from 'next/image';
import styles from '../controlPanel.module.css';
import PopupForm from '../../templateComponents/popupForm';
import {
	postImage,
	getBackground,
	getBackgroundsList,
} from '@/utils/api_wrap/fileAPI';
import InlineModal from '@/components/modals/inlineModal';
export default function SetCPBackground({ currentBack, setBack, envName }) {
	const [availableBacks, setAvailable] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [cbUrl, setCbUrl] = useState();
	useEffect(() => {
		console.debug(
			'effect on currentBack change w new currentback',
			currentBack
		);
		const resetCB = async () => {
			if (currentBack) {
				setLoading(true);
				try {
					console.debug('loading new cb');
					const newBU = await getBackground(envName, currentBack);
					console.debug('loaded new cb', newBU);
					setCbUrl(newBU);
				} catch (err) {
					console.debug('err resetting currentbackgroundurl');
					setError(err);
				} finally {
					setLoading(false);
				}
			}
		};
		resetCB();
	}, [currentBack]);
	const getBacks = async () => {
		setLoading(true);
		try {
			const urlist = await getBackgroundsList(envName);
			console.debug('urlist', urlist);
			const backsP = urlist.map(async url => {
				return [url.name, await getBackground(envName, url.name)];
			});
			const backs = await Promise.all(backsP);
			console.debug('avbacks', backs);
			setAvailable(backs);
		} catch (err) {
			setAvailable([]);
			setError(err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		getBacks();
	}, []);
	const handleUpload = async e => {
		const file = e.target.files?.[0];
		if (!file) return;
		setLoading(true);
		console.debug('file to upload in backs manager', file);
		try {
			await postImage(envName, file.name, file);
			await getBacks();
		} catch (err) {
			setError(err);
		}
		setLoading(false);
	};
	return (
		<PopupForm buttonTitle="Установить фон">
			{loading ? (
				<Loader />
			) : (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						{availableBacks.map(item => (
							<button
								onClick={() => {
									console.debug('clicked button');
									setBack(item[0]);
								}}
								style={{
									cursor: 'pointer',
									padding: '5px',
									margin: '5px',
									border: '1px solid gray',
								}}
								key={item[0]}
							>
								<Image src={item[1]} alt={item[0]} width={200} height={200} />
							</button>
						))}
					</div>
					<div style={{ border: '2px solid grey', padding: '10px' }}>
						<label>Текущее изображение:</label>
						{currentBack && cbUrl ? (
							<Image
								src={cbUrl}
								alt={currentBack}
								width={400}
								height={400}
								onLoad={e => {
									const naturalWidth = e.target.naturalWidth;
									const naturalHeight = e.target.naturalHeight;
									const ratio =
										naturalHeight > naturalWidth
											? naturalHeight / naturalWidth
											: naturalWidth / naturalHeight;
								}}
							/>
						) : (
							<p>Не установлено</p>
						)}
					</div>
					<input
						title="Загрузить"
						type="file"
						accept="image/*"
						onChange={handleUpload}
					/>
					<InlineModal state={error}>{error?.message}</InlineModal>
				</div>
			)}
		</PopupForm>
	);
}
