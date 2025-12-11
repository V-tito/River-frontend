"use client"
import AlterForm from "../forms/alterForm";
import PopupForm from "./popupForm";

const AlterModal = ({table, obj})=>{
    return (
        <PopupForm buttonLabel={"Изменить"}>
            <AlterForm table={table} object={obj}></AlterForm>
        </PopupForm>)
}
export default AlterModal