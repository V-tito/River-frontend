"use client";
import { useState } from 'react';
import styles from "./filter.module.css"; // Updated import path

const DeleteForm = (table) => {
    const [formData,setFormData]=useState()
  
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        }

    const handleSubmit = async (e) => {
        e.preventDefault();      
            try {
                const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/${table.table}/${formData.id}`,{
                  method: 'DELETE',//headers: {'Content-Type': 'application/json',}
                });
                console.log(`${process.env.API_URL}/api//river/v1/configurator/${table.table}/${formData.id}`);
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
              } catch (err) {
                if (err instanceof Error) {
                    console.log (`Error: ${err.message}`)
                    console.log(`${process.env.API_URL}/api/river/v1/configurator/${table.table}/${formData.id}`);
              }
             
            }
            window.location.reload();
        }
        
    const handleReset = (e)=>{
        e.preventDefault();
        setFormData([])
    }


    return (
        <form onSubmit={handleSubmit}>
                <div>
                    <label>{"id"}</label>
                    <input type="number"
                            id="id"
                            required
                            onChange={handleChange}
                        />
                </div>
            <button type="submit">Удалить</button>
            <button type="reset" className={styles.button} onClick={handleReset}>
            Очистить
            </button>

        </form>
    );}

export default DeleteForm;