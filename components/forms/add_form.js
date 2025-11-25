"use client";
import { useEffect, useState } from 'react';
import styles from "./form.module.css"; // Updated import path
import Modal from "../modal"
import { useGlobal } from '../../app/GlobalState';



const AddForm = (table) => {
  const {defaultScheme}=useGlobal()
    const [config, setConfig] = useState([]);
    const [formData,setFormData]=useState({})
    const [error,setError]=useState(null)
    const [loading, setLoading] = useState(true);
    const [defFD,setDef]=useState({})
    const [isOutput,setOutput]=useState(false)
    const [isStraight,setStraight]=useState(false)
    const [groupToNames,setGroupToNames]=useState({})
    const [boardToNames,setBoardToNames]=useState({})
    const [chosenBoard,setChosenBoard]=useState()
    const [chosenGroup,setChosenGroup]=useState()
    const aliases={"isOutput":isOutput,"isStraight":isStraight,"testBoard":chosenBoard,"parentGroup":chosenGroup}
    const setAliases={"isOutput":setOutput,"isStraight":setStraight,"testBoard":setChosenBoard,"parentGroup":setChosenGroup}
    const idToNameAliases={"testBoard":boardToNames,"parentGroup":groupToNames}
  
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
    };
    fetchConfig();
    if (table.table=="Signal"){
        const fetchGroups = async () => {
            try {
            const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/GroupOfSignals/${defaultScheme.id}`,{
              method: 'GET',// headers: new Headers({'Content-Type': 'application/json'})
            });
            if (!response.ok) {
              throw new Error('Ошибка сети');
            }
            const result = await response.json();
            
            return result
          } catch (err) {
            if (err instanceof Error) {
              setError(err);
          }
        }
        }
    const fetchBoards = async () => {
        try {
        const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/TestBoard/${defaultScheme.id}`,{
          method: 'GET',// headers: new Headers({'Content-Type': 'application/json'})
        });
        if (!response.ok) {
          throw new Error('Ошибка сети');
        }
        const result = await response.json();
        console.log('APIB',result)
        return result
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
      }
    }
    }
    const processConfig = async () => {
      const resBoards=await fetchBoards();
      console.log('RB',resBoards)
      const resGroups=await fetchGroups();
      const tempBoardNames=resBoards.reduce((acc,item)=>{
        return acc={...acc,[item.id]:item.name}
      },{})
      console.log(`tempBN:`,tempBoardNames)
      const tempGroupNames=resGroups.reduce((acc,item)=>{
        return acc={...acc,[item.id]:item.name}
      },{})
      setBoardToNames(tempBoardNames)
      console.log(Object.entries(tempGroupNames))
      setGroupToNames(tempGroupNames)
      setLoading(false)
    
  }
  processConfig()
}else{setLoading(false)}
  }, [table,defaultScheme]);

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
        //if ( "parentScheme" in formData) {
          newFormData["parentScheme"]= {"id": defaultScheme.id }
        //}; 
        if ("parentGroup"in formData) 
            {newFormData["parentGroup"]= {"id": aliases["parentGroup"] }};
        if ("testBoard" in formData) 
            {newFormData["testBoard"]= {"id": aliases["testBoard"] }}
        if (table.table=="Signal") {newFormData={...newFormData, "isOutput":String(isOutput),"isStraight":String(isStraight)}}

        try {
                const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/${table.table}`,{
                  method: 'POST',
                  body: JSON.stringify(newFormData),
                  headers: {'Content-Type': 'application/json',}
                });
                console.log(JSON.stringify(newFormData))
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
        
    const handleReset = (e)=>{
        e.preventDefault();
        setFormData(defFD)
    }

    const handleRadio = (e)=>{
        setAliases[e.target.id](e.target.value=="true")
    }

    const handleSelect=(e)=>{
      console.log(e.target.id)
      setAliases[e.target.id](e.target.value)
      console.log(aliases[e.target.id])
      console.log(e.target.value)
    }

    if (loading) return <p>Form loading...</p>;
    console.log(`BN:`,boardToNames)
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
          <header className={styles.header}>Добавить элемент</header>
            {config.map(field => (
                <div key={field.id}>
                    <label htmlFor={field.id}>{field.label} </label>
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
                        
                    ) : (field.type=="select" ? (<select
                        className={styles.input}
                        id={field.id}
                        value={aliases[field.id]}
                        required={field.required}
                        onChange={handleSelect}>
                          <option>Выберите элемент...</option>
                         {Object.entries(idToNameAliases[field.id]).map(item=>( <option key={item[0]} value={item[0]}>{item[1]}</option>))}
                        </select>) : (
                        <input
                            className={styles.input}
                            type={field.type}
                            id={field.id}
                            value={formData[field.id]}
                            required={field.required}
                            onChange={handleChange}
                        />
                    ))}
                </div>
            ))}
            <button type="submit" className={styles.button}>Создать</button>
            <button type="reset" className={styles.button} onClick={handleReset}>
            Очистить
            </button>
            <p><Modal state={error}>{error? error.message : ""}</Modal></p>
        </form>
    );}

export default AddForm;