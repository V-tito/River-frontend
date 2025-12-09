"use client"
import AlterForm from "./forms/alterForm"
import styles from "./alterButton.module.css"
import { useState } from "react"

const AlterButton=({table, obj})=>{
    const [showForm,setShowForm]=useState(false)
    const changeState=()=>{
        setShowForm(true)
    }
    return (
        <button className={styles.button} onClick={changeState}>
        Править
        
        <AlterForm table={table} isVisible={showForm} setIsVisible={setShowForm} object={obj}></AlterForm>
        </button>
    )
}

export default AlterButton