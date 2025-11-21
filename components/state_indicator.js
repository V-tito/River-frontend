"use client"
import { useState } from "react"
import styles from "./state_indicator.module.css"

const StateIndicator=({api,showCheckDisplaySettings=false})=>{
    const [on,setOn]=useState(false)
    const [checkConstantly,setCheck]=useState(false)
    /*useEffect(()=>{
        const fetchCurrentState = async ()=> { //STUB!
            const responce = await fetch ("there goes API", {method:"GET"})
            const result=await responce.json
            setOn(result.state)
        }
        fetchCurrentState()
    })*/
    const changeCheckSettings = () =>{
        setCheck((prev) => !prev);
    }
    return (<div><div className={`${styles.indicator} ${on ? styles.active : styles.inactive}`}></div>
    {showCheckDisplaySettings ? <input type="checkbox" checked={checkConstantly} onChange={changeCheckSettings}></input>:''}
    </div>)
}

export default StateIndicator