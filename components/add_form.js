"use client";
import { useEffect, useState } from 'react';
import styles from "./add_form.module.css"; // Updated import path
import { refresh } from 'next/cache';



const AddForm = (table) => {
    const [config, setConfig] = useState([]);
    const [formData,setFormData]=useState({})
    const [defFD,setDef]=useState({})
    const [isOutput,setOutput]=useState(false)
    const [isStraight,setStraight]=useState(false)
    const aliases={"isOutput":isOutput,"isStraight":isStraight}
    const setAliases={"isOutput":setOutput,"isStraight":setStraight}
  
    useEffect(() => {
        const fetchConfig = async () => {
        const response = await fetch(`/api/getAddConfig/${table.table}`);
        const data = await response.json();
        setConfig(data);
        let newFormData={}
        data.forEach(field => 
            (field.type="text") ? (newFormData[field.id] = ""):(newFormData[field.id] = "")
        );
        setFormData(newFormData);
        setDef(newFormData)
        console.log(newFormData)
    };
    fetchConfig();
    
    console.log(`/api/getAddConfig/${table.table}`)
  }, [table]);



    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [String(id)]: value });
        }

    const handleSubmit = async (e) => {
        e.preventDefault();  
        let newFormData={...formData}
        if ((["GroupOfSignals","TestBoard"].includes(table.table))&&(!("signals" in formData))) {
            newFormData={...newFormData, "signals":[]}
        }   
        if ( "parentScheme" in formData) 
            {newFormData["parentScheme"]= {"id": formData["parentScheme"] }}; 
        if ("parentGroup"in formData) 
            {newFormData["parentGroup"]= {"id": formData["parentGroup"] }};
        if ("testBoard" in formData) 
            {newFormData["testBoard"]= {"id": formData["testBoard"] }}
        if (table.table=="Signal") {newFormData={...newFormData, "isOutput":String(isOutput),"isStraight":String(isStraight)}}

        try {
                const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/${table.table}`,{
                  method: 'POST',
                  body: JSON.stringify(newFormData),
                  headers: {'Content-Type': 'application/json',}
                });
                console.log(JSON.stringify(newFormData))
                if (!response.ok) {
                  throw new Error(`Network response was not ok: ${response.status}`);
                }
                refresh
              } catch (err) {
                if (err instanceof Error) {
                    console.log (`Error: ${err.message}`)
              }
            }
           console.log(table.table)
        }
        
    const handleReset = (e)=>{
        e.preventDefault();
        setFormData(defFD)
    }

    const handleRadio = (e)=>{
        setAliases[e.target.id](e.target.value=="true")
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {config.map(field => (
                <div key={field.id}>
                    <label htmlFor={field.id}>{field.label}</label>
                    {field.type === 'radio' ? (<div><div><input className={styles.radio}
                            type="radio"
                            id={field.id}
                            name={field.label}
                            required={field.required}
                            value="true"
                            checked={aliases[field.id]==true}
                            onChange={handleRadio}
                        /> {field.values[0]}</div>
                        <div><input className={styles.radio}
                        type="radio"
                        id={field.id}
                        name={field.label}
                        required={field.required}
                        value="false"
                        label={field.values[1]}
                        checked={aliases[field.id]==false}
                        onChange={handleRadio}
                    /> {field.values[1]}</div>
                    </div>
                        
                    ) : (
                        <input
                            className={styles.input}
                            type={field.type}
                            id={field.id}
                            value={formData[field.id]}
                            required={field.required}
                            onChange={handleChange}
                        />
                    )}
                </div>
            ))}
            <button type="submit" className={styles.button}>Создать</button>
            <button type="reset" className={styles.button} onClick={handleReset}>
            Очистить
            </button>

        </form>
    );}

export default AddForm;