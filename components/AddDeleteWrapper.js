import AddButton from "./AddButon"
import DeleteButton from "./DeleteButon"
import styles from "./AddDeleteWrapper.module.css"

const AddDeleteWrapper = ({ table,listOfAll,children }) => {
    return (
        <div className={styles.wrap}>
        <div  className={styles.main}>
            {children}
            </div>
        <aside className={styles.aside}>
            <div>
            <AddButton table={table}></AddButton>
            <DeleteButton table={table} listOfAll={listOfAll}></DeleteButton></div>
      </aside>
        </div>
    )
}

export default AddDeleteWrapper