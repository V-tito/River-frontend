"use client";
import { useState } from 'react';
import styles from "./form.module.css"; // Updated import path
import ConfirmDeleteModal from "./confirmDeleteModal"


const DeleteForm = ({table,listOfAll=[[]]}) => {
    const [formData,setFormData]=useState()
    const [confirmUrl,setConfirmUrl]=useState(null)
  
    const handleChange = (e) => {
        const { id, value } = e.target;
        console.log(id," - ",value)
        setFormData({ ...formData, [id]: value });
        }

    const handleSubmit = (e)=>{
        e.preventDefault()
        setConfirmUrl(`${process.env.API_URL}/api/river/v1/configurator/${table}/${formData.id}`)
    }
        
    const handleReset = (e)=>{
        e.preventDefault();
        setFormData([])
    }

    console.log(listOfAll)
    if (listOfAll ===undefined) return (<p>Loading...</p>)
    console.log(listOfAll)
    return (<div>
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
            <button type="submit" className={styles.button}>Удалить</button>
            <button type="reset" className={styles.button} onClick={handleReset}>
            Очистить
            </button>
            <p></p>
        </form>
        <ConfirmDeleteModal state={confirmUrl} setState={setConfirmUrl}></ConfirmDeleteModal></div>
    );}

export default DeleteForm;