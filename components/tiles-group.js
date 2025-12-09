
import AlterButton from "./alterButton"
import styles from "./tile-builder.module.css";

const DataTiles = ({data}) => {
  console.log(data)
  return (
    <div className={styles.tiles}>{data.length > 0 ? (
      data.map((item) => (<div key={item.id} className={styles.tile}>
      <h1 className={styles.header}>{item.name}</h1>
      <p className={styles.description}>{item.description}</p>
      <AlterButton table={"GroupOfSignals"} obj={item}></AlterButton>
      </div>
      ))):null}</div>
  );
};

export default DataTiles;