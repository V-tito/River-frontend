import IndicatorsTable from './indicatorsTable';
import SulSigsTable from './sulSigsTable';
import ButtonsTable from './buttonsTable';
import styles from './stateTable.module.css';
import React, { useState } from 'react';
import headerStyles from '@/styles/headerStyles.module.css';
import PropTypes from 'prop-types';
const SignalTables = ({ data, group }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="flex flex-col">
			<button onClick={() => setIsOpen(!isOpen)} className={headerStyles.fold}>
				<div className="flex flex-row">
					<div
						className={`${headerStyles.triangle} transition-transform duration-300
            ${isOpen ? 'rotate-360' : 'rotate-270'}`}
					/>
					<h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
						Состояние сигналов группы {group}:
					</h1>
				</div>
			</button>
			{isOpen ? (
				<div className={styles.tableGrid}>
					<div className={styles.tableHolder}>
						<h2 className={headerStyles.tableHeader}>Входы</h2>
						<IndicatorsTable
							data={data.inputs}
							board={false}
							group={group}
						></IndicatorsTable>
					</div>
					<div className={styles.tableHolder}>
						<h2 className={headerStyles.tableHeader}>Выходы</h2>
						<ButtonsTable data={data.outputs} group={group}></ButtonsTable>
					</div>
					<div className={styles.tableHolder}>
						<h2 className={headerStyles.tableHeader}>Сигналы СУЛ</h2>
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
