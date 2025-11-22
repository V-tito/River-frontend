import styles from "./table-builder.module.css";
import StateIndicator from './state_indicator';
import StateButton from './state_button';

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
                <td className={styles.td}>{item.name}</td>
                <td className={styles.th}>{("isOutput" in item && item.isOutput) ? <StateButton sig={item.id}></StateButton>:<StateIndicator api=''></StateIndicator>}</td>
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