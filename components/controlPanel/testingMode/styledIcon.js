import styles from '../controlPanel.module.css';
import Image from 'next/image';
export default function StyledIcon({
	icon_,
	signal,
	position,
	on = 0,
	error = false,
	disabled = false,
	visibleLabel = true,
}) {
	const { parentGroup, name, turnedOnStatusName, turnedOffStatusName } = signal;
	return (
		<div
			className={styles.CPelem}
			style={{ top: position?.y, left: position?.x, position: 'absolute' }}
		>
			<Image
				src={
					disabled
						? icon_.disabled
						: on == undefined || error || on == -1
							? icon_.error
							: on > 0
								? icon_.on
								: icon_.off
				}
				className={styles.icon}
				width={56}
				height={56}
				alt={
					disabled
						? 'Нет данных'
						: on == undefined || error || on == -1
							? 'Ошибка получения данных'
							: on > 0
								? (turnedOnStatusName ?? 'Вкл')
								: (turnedOffStatusName ?? 'Выкл')
				}
			/>
			{visibleLabel && (
				<span className={styles.label}>
					{parentGroup}: {name}
				</span>
			)}
		</div>
	);
}
