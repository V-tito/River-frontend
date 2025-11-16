"use client";
//import RedirectForm from "../../components/redirect_form_for_board_nav"
import { useRouter } from 'next/navigation';
const RedirectStub = () => {
    const router=useRouter()
        router.push(`/TestBoard/${process.env.defaultScheme}`)
    //return (<div><p>{"Введите номер схемы"}</p><RedirectForm table="TestBoard"></RedirectForm></div>)
}
export default RedirectStub