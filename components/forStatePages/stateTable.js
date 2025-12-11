import styles from "./stateTable.module.css";
import StateIndicator from './stateIndicator';
import StateButton from './stateButton';

const StateTable = ({data}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Имя</th>
          <th className={styles.th}>Состояние</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => 
            
            <tr key={item.id}>
                <td className={`${styles.td} ${styles.namer}`}>{item.name}</td>
                <td className={styles.td}>{
                ("isOutput" in item ) ? 
                  ( item.isOutput ?
                      <StateButton sig={item}></StateButton> :
                      <StateIndicator sig={item}
                      //todo change to proper naming
                      >
                      </StateIndicator>)
                  :
                (<StateIndicator sig={item} board={true}>
                </StateIndicator>)}</td>
            </tr>
          )) : (
          <tr>
            <td colSpan='2' className={styles.td}>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StateTable;