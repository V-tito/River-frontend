"use client"
import DeleteModal from "./forms/deleteModal"
import styles from "./addButton.module.css"
import { useState } from "react"

const DeleteButton=({table, listOfAll})=>{
    const [showForm,setShowForm]=useState(false)
    const changeState=()=>{
        setShowForm(true)
    }
    return (
        <button className={styles.button} onClick={changeState}>
        Удалить
        
        <DeleteModal table={table} listOfAll={listOfAll}isVisible={showForm} setIsVisible={setShowForm}></DeleteModal>
        </button>
    )
}

export default DeleteButton