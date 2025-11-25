"use client"
import { useState } from "react"
import styles from "./state_button.module.css"

const StateButton=({sig})=>{
    const [on,setOn]=useState(false)
    /*useEffect(()=>{
        //тут надо будет по ид платы сигнала зафетчить адрес и сделать запрос о состоянии,
        const fetchCurrentState = async ()=> { //STUB!
            const responce = await fetch ("there goes API", {method:"GET"})
            const result=await responce.json
            setOn(result.state)
        }
        fetchCurrentState()
    })*/

    const changeState=async()=>{
            try {
                const response = await fetch ("STUB",{method:"POST", body:JSON.stringify({state:(!on)})})//possibly PUT
                if (!response.ok) {
                    throw new Error (`Network error ${responce.status}`)} else{setOn(!on)}
            } catch (err) {
                console.log(err)
        }

    }
    return ((<button className={`${styles.button} ${on?styles.on:styles.off}`} onClick={changeState}>{on?"Вкл.":"Выкл."}</button>))
}

export default StateButton