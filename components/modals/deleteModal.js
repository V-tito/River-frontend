"use client"
import DeleteForm from "../forms/deleteForm"
import PopupForm from "./popupForm";

const DeleteModal = ({table,listOfAll})=>{
    return (
        <PopupForm buttonLabel="Удалить">
            <DeleteForm table={table} listOfAll={listOfAll}></DeleteForm>
        </PopupForm>)
}
export default DeleteModal