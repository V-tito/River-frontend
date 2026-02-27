import IndicatorsTable from './indicatorsTable';
import SulSigsTable from './sulSigsTable';
import ButtonsTable from './buttonsTable';
import React, { useState } from 'react';
import styles from './stateTable.module.css';
import PropTypes from 'prop-types';
const SignalTables = ({ data, group }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="flex flex-col">
			<button onClick={() => setIsOpen(!isOpen)} className={styles.fold}>
				<div className="flex flex-row">
					<div
						className={`${styles.triangle} transition-transform duration-300
            ${isOpen ? 'rotate-0' : 'rotate-270'}`}
					/>
					<h1 className="text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
						Состояние сигналов группы {group}:
					</h1>
				</div>
			</button>
			{isOpen ? (
				<div className="flex flex-row">
					<div className="flex flex-col">
						<h2 className={styles.h2}>Входы</h2>
						<IndicatorsTable
							data={data.inputs}
							board={false}
							group={group}
						></IndicatorsTable>
					</div>
					<div className="flex flex-col">
						<h2 className={styles.h2}>Выходы</h2>
						<ButtonsTable data={data.outputs} group={group}></ButtonsTable>
					</div>
					<div className="flex flex-col">
						<h2 className={styles.h2}>Сигналы СУЛ</h2>
						<SulSigsTable
							data={data.sulSigs ? data.sulSigs : []}
							group={group}
						></SulSigsTable>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};
SignalTables.propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({})),
	group: PropTypes.string,
};
export default SignalTables;
