'use client';
import DownloadButton from './downloadButton';
import buttonStyles from '@/styles/buttonStyles.module.css';
const EnvDownload = ({ defaultScheme }) => {
	return (
		<DownloadButton
			filepath={`?envСonfig=${defaultScheme}`}
			filename={`env-config-${defaultScheme}.json`}
			buttonLabel="Получить конфигурационный файл рабочего пространства"
			className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
		></DownloadButton>
	);
};
export default EnvDownload;
