'use client';
import DownloadButton from './downloadButton';
import buttonStyles from '@/styles/buttonStyles.module.css';
const EnvDownload = ({ currentWS }) => {
	return (
		<DownloadButton
			type="env-base"
			envName={currentWS}
			filename={`env-config-${currentWS}.xml`}
			buttonLabel="Получить конфигурационный файл рабочего пространства"
			className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
		></DownloadButton>
	);
};
export default EnvDownload;
