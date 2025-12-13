"use client"
import AlterForm from "../forms/alterForm";
import PopupForm from "./popupForm";
import  React from "react"
import PropTypes from 'prop-types';

const AlterModal = ({table, obj})=>{
    return (
        <PopupForm buttonLabel={"Изменить"}>
            <AlterForm table={table} object={obj}></AlterForm>
        </PopupForm>)
}

AlterModal.propTypes={
        table: PropTypes.string.isRequired,
        obj:PropTypes.shape({
          parentGroup:PropTypes.number,
          testBoard:PropTypes.shape({
            id:PropTypes.number
          })
        })
    }

export default AlterModal