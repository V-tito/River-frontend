"use client"
//import RedirectForm from "../../components/redirect_form_for_board_nav"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
const RedirectStub = () => {
    const router=useRouter()
    useEffect(()=>{
        router.push(`/GroupOfSignals/${process.env.defaultScheme}`)})
    
    //return (<div><p>{"Введите номер схемы"}</p><RedirectForm table="GroupOfSignals"></RedirectForm></div>)
}
export default RedirectStub