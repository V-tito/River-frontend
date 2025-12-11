"use client"
import AddForm from "../forms/addForm";
import PopupForm from "./popupForm";

const AddModal = ({table})=>{
    return (
       <PopupForm buttonLabel={"Создать"}>
                <AddForm table={table}></AddForm></PopupForm>)
}
export default AddModal