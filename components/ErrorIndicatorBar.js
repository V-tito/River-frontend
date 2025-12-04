import styles from "./ErrorIndicatorBar.module.css"
const ErrorIndicatorBar = ({err=null, table})=>{
    const templates={
"signals":"состояния исходящих сигналов",
"boards":"соединения с платами"
    }
    return <div className={`${styles.eba} ${err==null ? styles.none : (err=="ok" ? styles.ok : styles.error)}`}><p className={styles.header}>Проверка {templates[table]}:</p>
{err==null ? <p>Проверка не производится...</p> : (err=="ok" ? <p>проверка успешна</p> : <p>{err.message}</p>)}
    </div>
}
export default ErrorIndicatorBar