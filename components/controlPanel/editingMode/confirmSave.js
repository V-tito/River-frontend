import React from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import PopupControlled from '../../templateComponents/popupControlled';
export default function ConfirmSave({ open, setOpen, saveConf }) {
	return (
		<PopupControlled open={open} setOpen={setOpen} label="Сохранить изменения?">
			<button
				onClick={async () => {
					await saveConf();
					afterSave();
					setOpen(false);
				}}
				className={`${buttonStyles.button}  ${buttonStyles.menuButton}`}
			>
				Сохранить
			</button>
			<button
				onClick={() => {
					setSaved(true);
					afterSave();
					setOpen(false);
				}}
				className={`${buttonStyles.button}  ${buttonStyles.deleteButton}`}
			>
				Не сохранять
			</button>
		</PopupControlled>
	);
}
