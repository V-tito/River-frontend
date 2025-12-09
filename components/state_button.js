"use client"
import { useState,useEffect } from "react"
import Modal from "./modal"
import styles from "./state_button.module.css"

const StateButton=({sig})=>{
    const [error, setError]=useState(null)
    const [on,setOn]=useState(() => {
        const savedVariable = localStorage.getItem(`Signal_${sig.id}_state`);
        if (savedVariable) {
            console.log("got saved", savedVariable, "for sig",sig.id)
            return (savedVariable!=null ? savedVariable==='true' : false);
        }
      })
    
    useEffect(()=>{
        localStorage.setItem(`Signal_${sig.id}_state`, on);
        console.log("saved", on, "for sig",sig.id)
},[sig,on]
    )
    const changeState=async()=>{
            try {
                const response = await fetch (`${process.env.API_URL}/api/river/v1/protocol/set`,
                    {method:"POST", 
                    body:JSON.stringify({id:sig.id, currentValue:!on}),
                    headers: {'Content-Type': 'application/json',}
                })
                console.log(`tried to set signal state with ${JSON.stringify({id:sig.id, currentValue:!on})}`)
                if (!response.ok) {
                    throw new Error (`Ошибка сети ${response.status}`)} else{setOn(!on)}
            } catch (err) {
                console.log(err)
                setError(err)
        }
    }
    console.log("state",on,"for sig",sig.id)
    return (<div>
        <button className={`${styles.button} ${on==true?styles.on:styles.off}`} onClick={changeState}>
        {on==true?"Вкл.":"Выкл."}
        </button>
        <p>{sig.isStraight?sig. turnedOnStatusName:sig. turnedOffStatusName}</p>
        <Modal state={error}>{error? error.message : ""}</Modal>
        </div>
    )
}

export default StateButton