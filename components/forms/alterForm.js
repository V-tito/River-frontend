"use client";
import React, { useEffect, useState } from 'react';
import styles from "./form.module.css"; // Updated import path
import Modal from "../modals/inlineModal"
import { useGlobal } from '../../app/GlobalState';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';


const AlterForm = ({table, object}) => {
  const defaults=(()=>{
    if (table!="Signal") {
      return {...object}
  } else {
    return {...object,parentGroup:object.parentGroup,testBoard:object.testBoard.id}
  }
  })
  const {defaultScheme}=useGlobal()
  const { register, handleSubmit,reset } = useForm({defaultValues:defaults()});
    const [config, setConfig] = useState([]);
    const [error,setError]=useState(null)
    const [loading, setLoading] = useState(true);
    const [groupToNames,setGroupToNames]=useState({})
    const [boardToNames,setBoardToNames]=useState({})
    const idToNameAliases={"testBoard":boardToNames,"parentGroup":groupToNames}
  
    useEffect(() => {
        const fetchConfig = async () => {
        const response = await fetch(`/api/getAddConfig/${table}`);
        const data = await response.json();
        setConfig(data);
    };
    fetchConfig();
    if (table=="Signal"){
      const fetchGroupsAndBoards = async () => {
        try{
          console.log(`/api/getListsOfGroupsAndBoards/${defaultScheme.id}`)
        const response = await fetch(`/api/getAddConfig/getListsOfGroupsAndBoards/${defaultScheme.id}`);
        const data = await response.json();
        if (!response.ok){
          throw new Error (`Ошибка сети ${response.status}`)
        }
        setBoardToNames(data.boards)
        setGroupToNames(data.groups)
      }catch(err){
        setError(err)
      }
}
fetchGroupsAndBoards()

setLoading(false)
    }
else{setLoading(false)}
  }, [table,defaultScheme]);

    const onSubmit = async (data) => { 
        let newFormData={...data}
        if ((["GroupOfSignals","TestBoard"].includes(table))&&(!("signals" in data))) {
            newFormData={...newFormData, "signals":[]}
            newFormData["parentScheme"]= {"id": defaultScheme.id }
        }    
        if ("parentGroup"in data) 
            {newFormData["parentGroup"]= {"id": data.parentGroup }};
        if ("testBoard" in data) 
            {newFormData["testBoard"]= {"id": data.testBoard }}

        try {
                const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/${table}`,{
                  method: 'PATCH',
                  body: JSON.stringify(newFormData),
                  headers: {'Content-Type': 'application/json',}
                });
                console.log("sent ",JSON.stringify(newFormData))
                if (!response.ok) {
                  console.log(JSON.stringify(newFormData))
                  throw new Error(`Ошибка сети: ${response.status}. Проверьте правильность заполнения формы.`);
                  
                }
                window.location.reload();
              } catch (err) {
                if (err instanceof Error) {
                  setError(err)
                    console.log (`Error: ${err.message}`)
              }
            }
        }
    if (loading) return <p>Form loading...</p>;
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <header className={styles.header}>Изменить элемент</header>
            {config.map(field => (
                <div key={field.id}>
                    <label className={styles.label} htmlFor={field.id}>{field.label} </label>
                    {field.type === 'radio' ? (<div className={styles.radio}><div ><input
                            type="radio"
                            id={field.id}
                            name={field.label}
                            value="true"
                            {...register(field.id,field.validation)}
                        /> {field.values[0]}</div>
                        <div><input
                        type="radio"
                        id={field.id}
                        name={field.label}
                        value="false"
                        {...register(field.id,field.validation)}
                    /> {field.values[1]}</div>
                    </div>
                        
                    ) : (field.type=="select" ? (<select
                        className={styles.input}
                        id={field.id}
                        
                        {...register(field.id,field.validation)}>
                          <option>Выберите элемент...</option>
                         {Object.entries(idToNameAliases[field.id]).map(item=>( <option key={item[0]} value={item[0]}>{item[1]}</option>))}
                        </select>) : (field.type=="textarea" ? (
                          <textarea id={field.id}
                            className={styles.input}
                            placeholder={field.placeholder}
                            {...register(field.id,field.validation)}
                            ></textarea>):(
                        <input
                            className={styles.input}
                            type={field.type}
                            id={field.id}
                            placeholder={object[field.id]}
                            {...register(field.id,field.validation)}
                        />
                    )))}
                </div>
            ))}
            <div className={styles.buttons}>
            <button type="submit" className={styles.button}>Отправить</button>
            <button type="reset" className={styles.button} onClick={() => reset()}>Очистить
            </button></div>
            <div><Modal state={error}>{error? error.message : ""}</Modal></div>
        </form>
    );}

    
    AlterForm.propTypes={
        table: PropTypes.string,
        object:PropTypes.shape({
          parentGroup:PropTypes.number,
          testBoard:PropTypes.shape({
            id:PropTypes.number
          })
        })
    }

export default AlterForm;