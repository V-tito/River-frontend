'use client';
import styles from './schemeUtils.module.css';
import EnvDownload from '@/components/fileManagement/envDownload';
import EnvUpload from '@/components/fileManagement/envUpload';

export default function SchemeUtils({ currentWS, admin }) {
	return (
		<div>
			<div className={styles.currentScheme}>
				<p>
					Текущее рабочее пространство:{' '}
					{currentWS == null ? 'не задана' : currentWS.name}
				</p>
			</div>
			{admin ? (
				<div>
					{currentWS == null ? (
						''
					) : (
						<EnvDownload currentWS={currentWS.name}></EnvDownload>
					)}
					<EnvUpload></EnvUpload>
				</div>
			) : (
				''
			)}
		</div>
	);
}
