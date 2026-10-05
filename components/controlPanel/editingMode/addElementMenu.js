import React from 'react';
import { useDraggable } from '@dnd-kit/react';
import { Feedback } from '@dnd-kit/dom';
import styles from '../controlPanel.module.css';
import icons from '../icons/icons';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import Image from 'next/image';
function DraggableIcon({ type_, icon }) {
	console.debug('type', type_, 'icon', icon);
}
function AddElementMenu() {
	return (
		<div className={styles.addMenu}>
			{Object.keys(icons).map((type_, i) => {
				console.debug('in map type_', type_, 'i', i);
				return (
					<div key={i}>
						{Object.keys(icons[type_]).map((icon, index) => {
							console.debug('in map2, type_', type_);
							const { ref } = useDraggable({
								id: icon,
								type: 'addmenu',
								data: { icon: icon, type: type_ },
								plugins: [
									Feedback.configure({
										feedback: 'clone',
										dropAnimation: null,
									}),
								],
							});
							const src = icons[type_][icon].off;
							return (
								<Image
									ref={ref}
									src={src}
									alt={type_}
									key={i + '_' + index}
									width={56}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
export default AddElementMenu;
