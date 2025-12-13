"use client"
import DeleteForm from "../forms/deleteForm"
import PopupForm from "./popupForm";
import React from "react";
import PropTypes from 'prop-types';

const DeleteModal = ({table,listOfAll})=>{
    return (
        <PopupForm buttonLabel="Удалить">
            <DeleteForm table={table} listOfAll={listOfAll}></DeleteForm>
        </PopupForm>)
}

DeleteModal.propTypes={
        table: PropTypes.string.isRequired,
        listOfAll:PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    }
export default DeleteModal