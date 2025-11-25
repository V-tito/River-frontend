"use client"
import { useState } from "react"
import styles from "./state_indicator.module.css"

const StateIndicator=({dst=null,ch=null, showCheckDisplaySettings=false})=>{
    const [on,setOn]=useState(false)
    const [checkConstantly,setCheck]=useState(false)
    const [lastCheckTime,setLastCheckTime]=useState(null)
    
    useEffect(()=>{
        
          //добавить колонку время проверки
        const fetchCurrentState = async ()=> { //STUB!
            let api=`${process.env.API_URL}/api/river/v1/protocol`
            if (dst!=null){urlParams = new URLSearchParams({destination:dst,channel:ch});
            api=api+urlParams.toString(); // Returns the query string
              }
            const responce = await fetch (api, {method:"GET"})
            const result=await responce.json
            setOn(result.state)
            setLastCheckTime(result.time)//todo actual key
        }
        fetchCurrentState()
    })
    const changeCheckSettings = () =>{
        setCheck((prev) => !prev);
    }
    return (<div><div className={`${styles.indicator} ${on ? styles.active : styles.inactive}`}></div>
    {showCheckDisplaySettings ? <input type="checkbox" checked={checkConstantly} onChange={changeCheckSettings}></input>:''}
    {lastCheckTime==null ? '': <p>Сигнал получен в ${lastCheckTime}</p>}
    </div>)
}

export default StateIndicator