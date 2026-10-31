import { useState, useEffect } from 'react';
import { netError } from '@/utils/api_wrap/netError';
import { Loader } from '@deemlol/next-icons';
import { FileMosaic, FileInputButton } from '@files-ui/react';
import styles from '../controlPanel.module.css';
import PopupForm from '../../templateComponents/popupForm';
import {
	postImage,
	getBackground,
	getBackgroundsList,
} from '@/utils/api_wrap/fileAPI';
import InlineModal from '@/components/modals/inlineModal';
export default function SetCPBackground({ currentBack, setBack, envName }) {
	const [availablaBacks, setAvailable] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const getBacks = async () => {
			try {
				const urlist = await getBackgroundsList(envName);
				setAvailable(urlist);
			} catch (err) {
				setError(err);
			}
			setLoading(false);
		};
		getBacks();
	}, []);
	const handleUpload = async e => {
		const file = e.target.files?.[0];
		if (!file) return;
		setLoading(true);
		try {
			await postImage(envName, file.name, file);
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
						{availablaBacks.map((index, url) => (
							<FileMosaic
								key={index}
								imageUrl={url}
								preview
								smartImgFit={'orientation'}
								onClick={() => setBack(url)}
								style={{ cursor: 'pointer' }}
							/>
						))}
					</div>
					<div style={{ border: '2px solid grey', padding: '10px' }}>
						<label>Текущее изображение</label>
						<FileMosaic imageUrl={currentBack} />
					</div>
					<input
						title="Загрузить"
						type="file"
						accept="image/*"
						onChange={handleUpload}
					/>
					<InlineModal state={error}>{error.message}</InlineModal>
				</div>
			)}
		</PopupForm>
	);
}
