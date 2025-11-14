"use client";
import RedirectForm from "../../components/redirect_form_for_board_nav"

const RedirectStub = () => {
    return (<div><p>{"Введите номер платы, чтобы перейти к сигналам этой платы"}</p><RedirectForm table="Signal/ByTestBoard"></RedirectForm>
    <p>{"Введите номер группы сигналов, чтобы перейти к сигналам этой группы"}</p><RedirectForm table="Signal/ByGroup"></RedirectForm>
    </div>)
}
export default RedirectStub