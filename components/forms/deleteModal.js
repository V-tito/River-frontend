"use client"
import DeleteForm from "./delete_form"
import Popup from 'reactjs-popup';
import styles from "./alterForm.module.css";
import "./popup.css"

const DeleteModal = ({table,listOfAll,isVisible,setIsVisible})=>{
    const onClose = ()=>{
        setIsVisible(false)
      }
      console.log("delmod table",table)
      console.log("delmod list",listOfAll)
    return (
        <Popup open={isVisible} onClose={onClose}>
            <DeleteForm table={table} listOfAll={listOfAll}></DeleteForm>
            <button onClick={onClose} className={styles.button}>Закрыть</button>
        </Popup>)
}
export default DeleteModal