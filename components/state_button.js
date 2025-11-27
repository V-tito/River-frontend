"use client"
import { useState,useEffect } from "react"
import styles from "./state_button.module.css"

const StateButton=({sig})=>{
    const [on,setOn]=useState(false)
    const [lastCheckTime,setLastCheckTime]=useState(null)
    
    useEffect(()=>{
        //тут надо будет по ид платы сигнала зафетчить адрес и сделать запрос о состоянии,
        const fetchCurrentState = async ()=> { //STUB!
            const api=new URL(`${process.env.API_URL}/api/river/v1/protocol/get`)
            api.searchParams.set('id',sig)
            const responce = await fetch (api.toString(), 
                    {method:"GET", 
                        //body: JSON.stringify({id:sig}),
                        headers: {'Content-Type': 'application/json',}
                    })
        console.log(`tried to get signal state with ${JSON.stringify({id:sig})}`)
        const result=await responce.json()
        setOn(result.state)
        setLastCheckTime(result.time)//todo actual key
    }
    fetchCurrentState()
    const intervalId = setInterval(fetchCurrentState, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId);
},[sig])

    const changeState=async()=>{
            try {
                const response = await fetch (`${process.env.API_URL}/api/river/v1/protocol/set`,
                    {method:"POST", 
                    body:JSON.stringify({id:sig, currentValue:!on}),
                    headers: {'Content-Type': 'application/json',}
                })
                console.log(`tried to set signal state with ${JSON.stringify({id:sig, currentValue:!on})}`)
                if (!response.ok) {
                    throw new Error (`Ошибка сети ${response.status}`)} else{setOn(!on)}
            } catch (err) {
                console.log(err)
        }

    }
    return (<div><button className={`${styles.button} ${on?styles.on:styles.off}`} onClick={changeState}>{on?"Вкл.":"Выкл."}</button>
        {lastCheckTime==null ? '': <p>Сигнал получен в ${lastCheckTime}</p>}</div>
    )
}

export default StateButton