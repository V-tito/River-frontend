import React, { useState } from 'react';
import styles from './modal.module.css';
import Popup from 'reactjs-popup';
//import 'reactjs-popup/dist/index.css';
import Modal from './inlineModal';
import PropTypes from 'prop-types';
import { deleteEntity } from '@/lib/api_wrap/configAPI';
const ConfirmDeleteModal = ({ state }) => {
	const [error, setError] = useState(null);
	console.log('configured url', state);

	const onConfirm = async () => {
		try {
			console.log('configured url from onconfirm', state);
			const response = await deleteEntity(state.type, state.name);

			if (!response.ok) {
				throw new Error(`Ошибка сети: ${response.status}`);
			}
			window.location.reload();
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
				console.log(`Error: ${err.message}`);
			}
		}
	};

	return (
		<Popup trigger={<button className={styles.menuButton}>Удалить</button>}>
			{close => (
				<div className={styles.container}>
					<div className={styles.header}> Подтверждение действия </div>
					Удаление этого элемента повлечет удаление всех зависящих от него
					элементов. Вы уверены, что хотите продолжить?
					<div className={styles.actions}>
						<button onClick={onConfirm} className={styles.alterButton}>
							Подтвердить
						</button>
						<button onClick={() => close()} className={styles.closeButton}>
							Отменить
						</button>
						<Modal state={error}>{error ? error.message : ''}</Modal>
					</div>
				</div>
			)}
		</Popup>
	);
};
ConfirmDeleteModal.propTypes = {
	state: PropTypes.string.isRequired,
};

export default ConfirmDeleteModal;
