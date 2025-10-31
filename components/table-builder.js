import React from 'react';
import styles from "./table-builder.module.css";

const DataTable = ({datar}) => {
  const data=datar.results
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key} className={styles.th}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id}>
              {Object.values(item).map((value, index) => (
                <td key={index} className={styles.td}>{value}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={Object.keys(data[0] || {}).length} className={styles.td}>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DataTable;