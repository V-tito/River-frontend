import React, { useEffect, useState } from 'react';
import styles from "./table-builder.module.css";
import AlterButton from "./alterButton"

const DataTable = ({data,kind}) => {
  const [config,setConfig]=useState({})
  const aliases={"isOutput":{true:"Исходящий",false:"Входящий"},
  "isStraight":{true:"Прямой",false:"Инвертированный"}}
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
          {Object.keys(data[0] || {}).map((key) => ((key in config)?((key != "description" ?
            <th key={key} className={styles.th}>{config[key]}</th>:(''))):
            (key =="testBoard" ? <th key={key} className={styles.th}>{"Плата"}</th>:'')
          ))}
          <th className={styles.th}>{"Описание"}</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id}>
              {Object.entries(item).map(item1 => ((item1[0] in config)?
              ((item1[0]!="description")?
                <td key={item1[0]} className={styles.td}>{item1[0] in aliases? aliases[item1[0]][item1[1]]: String(item1[1])}</td>:null)
                :(item1[0] =="testBoard" ? <td key={item1[0]} className={styles.td}>{item1[1].name}</td>:null)
              ))}
              <td  className={styles.td}>{String(item.description)}</td>
              <AlterButton table={kind}obj={item}></AlterButton>
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