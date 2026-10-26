import { useState } from 'react';
import { netError } from '@utils/api_wrap/netError';
import { Loader } from '@deemlol/next-icons';
import { FileMosaic } from '@files-ui/react';
export default function SetCPBackground(currentBack, setBack, envName) {
	const [availablaBacks, setAvailable] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const getBacks = async () => {
			const response = await fetch(`/api/files/CPbackgrounds?env=${envName}`, {
				method: 'GET',
			});
			if (!response.ok) throw netError(response);
			const urlist = await response.json();
			setAvailable(urlist);
			setLoading(false);
		};
		getBacks();
	}, []);
	const uploadNewBack = newBack => {};
	if (loading) return <Loader />;
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<div style={{ border: '2px solid grey', padding: '10px' }}>
				<label>Текущее изображение</label>
				<FileMosaic imageUrl={currentBack} />
			</div>
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
		</div>
	);
}
