"use client";
import { useState } from 'react';
import styles from "./form.module.css"; // Updated import path

const DeleteForm = ({table,listOfAll=[[]]}) => {
    const [formData,setFormData]=useState()
  
    const handleChange = (e) => {
        const { id, value } = e.target;
        console.log(id," - ",value)
        setFormData({ ...formData, [id]: value });
        }

    const handleSubmit = async (e) => {
        e.preventDefault();      
            try {
                const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/${table}/${formData.id}`,{
                  method: 'DELETE',//headers: {'Content-Type': 'application/json',}
                });
                console.log(`${process.env.API_URL}/api/river/v1/configurator/${table}/${formData.id}`)
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
              } catch (err) {
                if (err instanceof Error) {
                    console.log (`Error: ${err.message}`)
    
              }
             
            }
            window.location.reload();
        }
        
    const handleReset = (e)=>{
        e.preventDefault();
        setFormData([])
    }
    console.log(listOfAll)
    if (listOfAll ===undefined) return (<p>Loading...</p>)
    console.log(listOfAll)
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label>{"Выберите элемент для удаления:"}</label>
                    <select className={styles.input} type="number"
                            id="id"
                            required
                            onChange={handleChange}>
                                {(listOfAll.map(item=>(item.map(piece=><option key={piece.id} value={piece.id}>{piece.name}</option>))))}
                            </select>
                </div>
            <button type="submit" className={styles.button}>Удалить</button>
            <button type="reset" className={styles.button} onClick={handleReset}>
            Очистить
            </button>

        </form>
    );}

export default DeleteForm;