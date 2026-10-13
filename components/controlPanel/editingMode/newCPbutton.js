import React, { useEffect, useState } from 'react';
import PopupForm from '@/components/templateComponents/popupForm';
import Popup from 'reactjs-popup';
import FlexMenuButton from '@/components/templateComponents/buttons/flexMenuButton';
import PopupControlled from '@/components/templateComponents/popupControlled';
import { useForm } from 'react-hook-form';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { Plus } from '@deemlol/next-icons';
import ConfirmSave from './confirmSave';
function NewCPbutton({ add, getname }) {
	const { register, handleSubmit, resetDefaultValues, reset } = useForm({
		defaultValues: { name: getname() + '.json' },
	});
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		const newname = getname() + '.json';
		console.debug('rsetting defaults to', newname);
		resetDefaultValues({ name: newname });
		reset();
	}, [isOpen]);

	return (
		<>
			<FlexMenuButton
				buttonLabel={<Plus />}
				buttonTitle="Новая панель"
				onClick={() => setIsOpen(true)}
			/>
			<PopupControlled open={isOpen} setOpen={setIsOpen} label="Новая панель">
				<form
					onSubmit={handleSubmit(data => {
						console.debug('adding cp');
						add(data.name);
						resetDefaultValues({ name: getname() + '.json' });
						reset();
						setIsOpen(false);
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
			</PopupControlled>
		</>
	);
}
export default NewCPbutton;
