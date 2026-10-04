import React, { useState } from 'react';
import { Delete } from '@deemlol/next-icons';
import FlexMenuButton from '@/components/templateComponents/buttons/flexMenuButton';
import PopupControlled from '@/components/templateComponents/popupControlled';
export default function DeleteButton({ del }) {
	const [displayMessage, setDisplay] = useState(false);
	return (
		<>
			<FlexMenuButton
				buttonTitle="Удалить"
				buttonLabel={<Delete />}
				onClick={() => {
					del();
					setDisplay(true);
				}}
			/>
			<PopupControlled
				open={displayMessage}
				setOpen={setDisplay}
				label="Удалено"
			>
				<p>Удалено!</p>
			</PopupControlled>
		</>
	);
}
