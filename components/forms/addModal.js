"use client"
import AddForm from "./add_form";
import Popup from 'reactjs-popup';
import styles from "./alterForm.module.css";
import "./popup.css"

const AddModal = ({table,isVisible,setIsVisible})=>{
    const onClose = ()=>{
        setIsVisible(false)
      }
      console.log("isVisibleAdd",isVisible)
      console.log("Addmod table",table)
    return (
        <Popup open={isVisible} onClose={onClose}>
            <AddForm table={table}></AddForm>
            <button onClick={onClose} className={styles.button}>Закрыть</button>
        </Popup>)
}
export default AddModal