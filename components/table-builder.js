import React, { useEffect, useState } from 'react';
import styles from "./table-builder.module.css";

const DataTable = ({data}) => {
  const [config,setConfig]=useState({})
  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch('/api/parse_headers');
      const conf = await response.json();
      setConfig(conf[0]);
    };

    fetchConfig();
  }, []);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key} className={styles.th}>{(key in config)?(config[key]):key}</th>
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