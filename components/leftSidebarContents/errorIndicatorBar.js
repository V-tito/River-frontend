import styles from "./errorIndicatorBar.module.css"
const ErrorIndicatorBar = ({err=null})=>{

    return <div className={`${styles.eba} ${err==null ? styles.none : (err=="ok" ? styles.ok : styles.error)}`}><p className={styles.header}>Связь с сервером:</p>
{err==null ? <p>Запросы не производятся...</p> : (err=="ok" ? <p>Соединение успешно</p> : <p>{err.message}</p>)}
    </div>
}
export default ErrorIndicatorBar