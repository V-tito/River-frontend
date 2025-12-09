
import styles from "./tile-builder.module.css";

const DataTiles = ({data}) => {
  const aliases={"isOutput":{true:"Исходящий",false:"Входящий"},
  "isStraight":{true:"Прямой",false:"Инвертированный"}}
  console.log(data)
  return (
    <div className={styles.tiles}>{data.length > 0 ? (
      data.map((item) => (<div key={item.id} className={styles.tile}>
      <h1 className={styles.header}>{item.name}</h1>
      <p><span className={styles.feature}>Плата: </span><span>{item.testBoard.name}</span></p>
      <p><span className={styles.feature}>Канал: </span><span>{item.channel}</span></p>
      <p className={styles.feature}>Имя активного состояния: </p><span>{item.turnedOnStatusName}</span>
      <p className={styles.feature}>Имя неактивного состояния: </p><span>{item.turnedOffStatusName}</span>
      <p><span className={styles.feature}>Канал: </span><span>{item.channel}</span></p>
      <div className={styles.types}>
      <div className={`${styles.type} ${item.isOutput ? styles.true : styles.false}`}>{aliases["isOutput"][item.isOutput]}</div>
      <div className={`${styles.type} ${item.isStraight ? styles.true : styles.false}`}>{aliases["isStraight"][item.isStraight]}</div>
      </div>
      <p className={styles.feature}>{item.description}</p>
      </div>
      ))):null}</div>
  );
};

export default DataTiles;