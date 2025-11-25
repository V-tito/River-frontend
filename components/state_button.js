"use client"
import { useState } from "react"
import styles from "./state_button.module.css"

const StateButton=({dst=null,ch=null})=>{
    const [on,setOn]=useState(false)
    
    /*useEffect(()=>{
        //тут надо будет по ид платы сигнала зафетчить адрес и сделать запрос о состоянии,
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
})*/

    const changeState=async()=>{
            try {
                let api=`${process.env.API_URL}/api/river/v1/protocol`
                if (dst!=null){urlParams = new URLSearchParams({destination:dst,channel:ch,value:!on});
                api=api+urlParams.toString(); // Returns the query string
                }
                const response = await fetch (api,{method:"POST", body:JSON.stringify({state:(!on)})})//possibly PUT
                if (!response.ok) {
                    throw new Error (`Ошибка сети ${response.status}`)} else{setOn(!on)}
            } catch (err) {
                console.log(err)
        }

    }
    return ((<button className={`${styles.button} ${on?styles.on:styles.off}`} onClick={changeState}>{on?"Вкл.":"Выкл."}</button>))
}

export default StateButton