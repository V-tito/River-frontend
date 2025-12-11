"use client";
import { useState } from 'react';
import styles from "./form.module.css"; // Updated import path
import ConfirmDeleteModal from "../modals/confirmDeleteModal"


const DeleteForm = ({table,listOfAll=[[]]}) => {
    const [formData,setFormData]=useState()
    const [confirmUrl,setConfirmUrl]=useState(null)
  
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setConfirmUrl(`${process.env.API_URL}/api/river/v1/configurator/${table}/${value}`)
        }

    const handleSubmit = (e)=>{
        e.preventDefault()
    }

    console.log(listOfAll)
    if (listOfAll ===undefined) return (<p>Loading...</p>)
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <header className={styles.header}>Удалить элемент</header>
                <div>
                    <label>{"Выберите элемент для удаления:"}</label>
                    <select className={styles.input} type="number"
                            id="id"
                            required
                            onChange={handleChange}>
                                <option value={null}>Выберите элемент...</option>
                                {(listOfAll.map(item=>((item instanceof Array) ? (item.map(piece=><option key={piece.id} value={piece.id}>{piece.name}</option>)):(<option key={item.id} value={item.id}>{item.name}</option>))))}
                            </select>
                </div>
                <ConfirmDeleteModal state={confirmUrl}></ConfirmDeleteModal>
            <p></p>
        </form>
    );}

export default DeleteForm;