"use client"
import AddModal from "./forms/addModal"
import styles from "./addButton.module.css"
import { useState } from "react"

const AddButton=({table})=>{
    const [showForm,setShowForm]=useState(false)
    const changeState=()=>{
        setShowForm(true)
        console.log("setShow")
    }
    console.log("showFormAdd",showForm)
    return (
        <button className={styles.button} onClick={changeState}>
        Создать
        <AddModal table={table} isVisible={showForm} setIsVisible={setShowForm}></AddModal>
        </button>
    )
}

export default AddButton