import AddModal from "./modals/addModal"
import DeleteModal from "./modals/deleteModal"
import styles from "./addDeleteWrapper.module.css"

const AddDeleteWrapper = ({ table,listOfAll,children }) => {
    return (
        <div className={styles.wrap}>
        <div  className={styles.main}>
            {children}
            </div>
        <aside className={styles.aside}>
            <div>
            <AddModal table={table}></AddModal>
            <DeleteModal table={table} listOfAll={listOfAll}></DeleteModal></div>
      </aside>
        </div>
    )
}

export default AddDeleteWrapper