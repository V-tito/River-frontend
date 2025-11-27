"use client"
import { useState,useEffect } from "react"
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
                    api=new URL(`${process.env.API_URL}/api/river/v1/protocol/nop`)
                } else {
                    api=new URL(`${process.env.API_URL}/api/river/v1/protocol/get`)
                }
                api.searchParams.set('id',sig)
                const response = await fetch (api.toString(), 
                    {method:"GET", 
                        //body: JSON.stringify({id:sig}),
                        //headers: {'Content-Type': 'application/json',}
                    })
                console.log(`tried to get state on api ${api.toString()}`)
                const result= await response.json()
                console.log("received:", result)
                
                if (!board) {setOn(result.b)
                    setLastCheckTime(String(result.a))//todo actual key
                console.log("with id",sig,"set state",on,"with last check time",lastCheckTime)
                }else {setOn(result)}
        }
        fetchCurrentState()
        const intervalId = setInterval(fetchCurrentState, 500); // Fetch every 5 seconds
        return () => clearInterval(intervalId);
    },[sig,board])
    const changeCheckSettings = () =>{
        setCheck((prev) => !prev);
    }
    return (<div><div className={`${styles.indicator} ${on==true ? styles.active : styles.inactive}`}></div>
    {showCheckDisplaySettings ? <input type="checkbox" checked={checkConstantly} onChange={changeCheckSettings}></input>:''}
    {lastCheckTime==null ? '': <p>Сигнал получен в {lastCheckTime}</p>}
    </div>)
}

export default StateIndicator