import React, { useState } from 'react';
import PopupForm from '@/components/templateComponents/popupForm';
import Popup from 'reactjs-popup';
import { useForm } from 'react-hook-form';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { Plus } from '@deemlol/next-icons';
import ConfirmSave from './confirmSave';
function NewCPbutton({ add }) {
	const { register, handleSubmit, reset, watch } = useForm({
		defaultValues: { name: 'new' + crypto.randomUUID() + '.json' },
	});

	return (
		<PopupForm
			buttonLabel={<Plus />}
			buttonTitle="Новая панель"
			label={'Новая панель'}
		>
			<form
				onSubmit={handleSubmit(data => {
					console.debug('adding cp');
					add(data.name);
				})}
			>
				<input
					type="text"
					id={crypto.randomUUID()}
					name="name"
					className={inputStyles.input}
					{...register('name')}
				/>
				<button
					type="submit"
					className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
				>
					Создать
				</button>
			</form>
		</PopupForm>
	);
}
export default NewCPbutton;
