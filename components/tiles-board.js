
import AlterButton from "./alterButton"
import styles from "./tile-builder.module.css";

const DataTiles = ({data}) => {
  console.log(data)
  return (
    <div className={styles.tiles}>{data.length > 0 ? (
      data.map((item) => (<div key={item.id} className={styles.tile}>
      <h1 className={styles.header}>{item.name}</h1>
      <p><span className={styles.feature}>Адрес: </span><span>{item.address}</span></p>
      <p><span className={styles.feature}>Версия протокола: </span><span>{item.protocolVersion}</span></p>
      <p><span className={styles.feature}>Количество входных портов: </span><span>{item.maxInputs}</span></p>
      <p><span className={styles.feature}>Количество выходов: </span><span>{item.maxOutputs}</span></p>
      <p className={styles.description}>{item.description}</p>
      <AlterButton table={"TestBoard"} obj={item}></AlterButton>
      </div>
      ))):null}</div>
  );
};

export default DataTiles;