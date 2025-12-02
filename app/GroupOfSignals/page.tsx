"use client"
//import //logger from "../..///logger";
//import RedirectForm from "../../components/redirect_form_for_board_nav"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGlobal } from '../GlobalState';
const RedirectStub = () => {
    const { defaultScheme } = useGlobal();
    const router=useRouter()
    useEffect(()=>{
        //logger.info("entered redirect page for group of signals, redirect for defScheme", defaultScheme)
        router.push(`/GroupOfSignals/${defaultScheme.id}`)})
    
    //return (<div><p>{"Введите номер схемы"}</p><RedirectForm table="GroupOfSignals"></RedirectForm></div>)
}
export default RedirectStub