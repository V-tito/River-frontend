'use client';
import styles from './schemeUtils.module.css';
import EnvDownload from '@/components/fileManagement/envDownload';
import EnvUpload from '@/components/fileManagement/envUpload';

export default function SchemeUtils({ defaultScheme, admin }) {
	return (
		<div>
			<div className={styles.currentScheme}>
				<p>
					Текущая схема:{' '}
					{defaultScheme == null ? 'не задана' : defaultScheme.name}
				</p>
			</div>
			{admin ? (
				<div>
					{defaultScheme == null ? (
						''
					) : (
						<EnvDownload defaultScheme={defaultScheme.name}></EnvDownload>
					)}
					<EnvUpload></EnvUpload>
				</div>
			) : (
				''
			)}
		</div>
	);
}
