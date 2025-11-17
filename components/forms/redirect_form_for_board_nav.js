"use client";
import { useState } from 'react';
//import styles from "./redirect_form_for_board_nav.module.css"; // Updated import path
import { useRouter } from 'next/navigation';

const RedirectForm = (table) => {
    const [formData,setFormData]=useState()
    const router=useRouter()
  
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        }

        const handleRedirect = () => {
            router.push(`/${table.table}/${formData.id}`); // Navigate to another page`
        };


    return (
        <form onSubmit={handleRedirect}>
                <div>
                    <label>{"id"}</label>
                    <input type="number"
                            id="id"
                            required
                            onChange={handleChange}
                        />
                </div>
            <button type="submit">Перейти</button>
        </form>
    );}

export default RedirectForm;