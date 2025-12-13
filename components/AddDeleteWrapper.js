import AddModal from "./modals/addModal"
import DeleteModal from "./modals/deleteModal"
import styles from "./addDeleteWrapper.module.css"
import  React from "react"
import PropTypes from 'prop-types';
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
AddDeleteWrapper.propTypes={
    table: PropTypes.string.isRequired,
    listOfAll:PropTypes.arrayOf(PropTypes.shape({})),
    children:PropTypes.node
}

export default AddDeleteWrapper