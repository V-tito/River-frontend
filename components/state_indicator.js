"use client"
import { useState } from "react"
import styles from "./state_indicator.module.css"

const StateIndicator=({sig, showCheckDisplaySettings=false, board=false})=>{
    const [on,setOn]=useState(false)
    const [checkConstantly,setCheck]=useState(false)
    const [lastCheckTime,setLastCheckTime]=useState(null)
    
    useEffect(()=>{
        
          //добавить колонку время проверки
            const fetchCurrentState = async ()=> { //STUB!
                let api
                if (board) {
                    api=`${process.env.API_URL}/api/river/v1/protocol/nop`
                } else {
                    api=`${process.env.API_URL}/api/river/v1/protocol/get`
                }
                const responce = await fetch (api, {method:"GET", body: json.stringify({id:sig})})
                console.log(`tried to get state on api ${api} with ${json.stringify({id:sig})}`)
                const result=await responce.json
                
                if (!board) {setOn(result.a)
                    setLastCheckTime(result.b)//todo actual key
                }else {setOn(result)}
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