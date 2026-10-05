'use client';
import DownloadButton from './downloadButton';
import buttonStyles from '@/styles/buttonStyles.module.css';
const EnvDownload = ({ currentWS }) => {
	return (
		<DownloadButton
			filepath={`?envСonfig=${currentWS}`}
			filename={`env-config-${currentWS}.xml`}
			buttonLabel="Получить конфигурационный файл рабочего пространства"
			className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
		></DownloadButton>
	);
};
export default EnvDownload;
