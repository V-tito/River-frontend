"use client";
import React, { useState } from "react";
import styles from "./filter.module.css"; // Updated import path
import { useRouter } from 'next/navigation'

const Filter = (table) => {
    const [Filters, setFilters] = useState([]);
    const [LatestFilter, setLatestFilter]=useState({field:"",value:""})
    const router = useRouter()
    const handleChange = (e) => {
        const {name,value}=e.target;
        setLatestFilter((prev) => ({
            ...prev, // Spread operator to keep existing properties
            [name]: value, // Update the specific property based on the input name
        }))
    }

    const validateFilter = () => {
        const { field, value } = LatestFilter;
        if (field=="" || value=="" ) {
            return false; // Not all fields are filled
        }
        return true; // All fields are filled
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (validateFilter()) {setFilters([ ...Filters, LatestFilter]);}
        setLatestFilter({field:"",value:""})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();      
            const addr=`/api/${table}${Filters.reduce((acc, curr) => {
                return acc ? `${acc}&${curr.field}=${curr.value}` : `${curr.field}=${curr.value}`;
            }, '')}`
            router.push(addr)
        }
        
    const handleReset = (e)=>{
        e.preventDefault();
        setFilters([])
    }
    const handleRemove = (target)=>{
        setFilters(Filters.filter(item=>item!=target))
    }

    return (
        <div>
        <form className={styles.filter} onSubmit={handleSubmit} onReset={handleReset}>
            <label htmlFor="name" className={styles.label}>
                поле:
            </label>
            <input
                type="text"
                id="field"
                name="field"
                value={LatestFilter.field}
                onChange={handleChange}
                className={styles.input} 
                required
                />
            <label htmlFor="value" className={styles.label}>
                значение
            </label>
            <input
                type="text"
                id="value"
                name="value"
                value={LatestFilter.value}
                onChange={handleChange}
                className={styles.input} 
                required
                />
            <button type="add" className={styles.button} onClick={handleAdd}>
                Добавить
            </button>
                       
        </form>
        {Filters.map((item) => (
            <li key={item.field}>{item.field}={item.value}<button type="remove" className={styles.button} onClick={()=>handleRemove(item)}>Удалить</button>
            </li>
          ))}
        <button type="submit" className={styles.button} onClick={handleSubmit}>
            Применить
        </button>
        <button type="reset" className={styles.button} onClick={handleReset}>
            Очистить
        </button>
        </div>
    );
};

export default Filter;