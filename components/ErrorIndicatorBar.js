import styles from "./ErrorIndicatorBar.module.css"
const ErrorIndicatorBar = ({err=null})=>{
    return <div className={`${styles.eba} ${err==null ? styles.ok:styles.error}`}>
{err==null ? <p>Проверка состояния исходящих сигналов успешна</p> : <div><p>{err.message}</p><p></p></div> }
    </div>
}
export default ErrorIndicatorBar