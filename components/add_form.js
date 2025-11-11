"use client";
import { useEffect, useState } from 'react';
import styles from "./filter.module.css"; // Updated import path


const AddForm = (table) => {
    const [config, setConfig] = useState([]);
    const [formData,setFormData]=useState({})
  
  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch(`/api/getAddConfig/${table.table}`);
      const data = await response.json();
      setConfig(data);
    };

    fetchConfig();
    console.log(`/api/getAddConfig/${table.table}`)
  }, [formData,table]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        }

    const handleSubmit = async (e) => {
        e.preventDefault();      
            try {
                const response = await fetch(`/api//river/v1/configurator/${table.table}/0`,{
                  method: 'POST',
                  body:formData
                });
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
              } catch (err) {
                if (err instanceof Error) {
                    console.log (`Error: ${err.message}`)
                    console.log(`/api//river/v1/configurator/${table.table}`)
              }
             
            }
        }
        
    const handleReset = (e)=>{
        e.preventDefault();
        setData([])
    }


    return (
        <form onSubmit={handleSubmit}>
            {config.map(field => (
                <div key={field.id}>
                    <label htmlFor={field.id}>{field.label}</label>
                    {field.type === 'textarea' ? (
                        <textarea
                            id={field.id}
                            required={field.required}
                            onChange={handleChange}
                        />
                    ) : (
                        <input
                            type={field.type}
                            id={field.id}
                            required={field.required}
                            onChange={handleChange}
                        />
                    )}
                </div>
            ))}
            <button type="submit">Создать</button>
            <button type="reset" className={styles.button} onClick={handleReset}>
            Очистить
            </button>

        </form>
    );}

export default AddForm;