import styles from "./ErrorIndicatorbar.module.css"
const ErrorIndicatorBar = ({err=null})=>{
    return <div className={styles.eba}>
<p>{err==null ? "Проверка состояния успешна" : `Ошибка сети: ${err.status ? err.status:"неизвестная ошибка." }`}</p>
{err.message ? <p>{err.message}</p>:null }
    </div>
}
export default ErrorIndicatorBar