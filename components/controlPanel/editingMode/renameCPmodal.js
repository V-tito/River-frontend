import React, { useEffect, useState } from 'react';
import PopupForm from '@/components/templateComponents/popupForm';
import { useForm } from 'react-hook-form';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import InlineModal from '@/components/modals/inlineModal';
import { netError } from '@/utils/api_wrap/netError';
import { Edit3 } from '@deemlol/next-icons';
function RenameCPmodal({ CPname, rename }) {
	const { register, handleSubmit, resetDefaultValues, reset, watch } = useForm({
		defaultValues: { name: CPname },
	});
	const [error, setError] = useState();
	useEffect(() => {
		console.debug('reset def', CPname);
		resetDefaultValues({ name: CPname });
		reset();
	}, [CPname]);
	return (
		<PopupForm buttonLabel={<Edit3 />} buttonTitle="Переименовать">
			<form
				onSubmit={handleSubmit(async data => {
					try {
						await rename(data.name);
						window.location.reload();
					} catch (err) {
						setError(err);
					}
				})}
			>
				<input
					type="text"
					id={crypto.randomUUID()}
					name="name"
					className={inputStyles.input}
					//value={CPname}
					{...register('name')}
				/>
				<button
					type="submit"
					className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
				>
					Переименовать
				</button>
			</form>
			<InlineModal state={error}>{error?.message ?? ''}</InlineModal>
		</PopupForm>
	);
}
export default RenameCPmodal;
