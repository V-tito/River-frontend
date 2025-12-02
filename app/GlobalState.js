"use client"
import logger from "../logger";
import React, { createContext, useContext, useState,useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  /*const fetchScheme = async () => {
    const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/Scheme`,{
      method: 'GET',
      //headers: {'Content-Type': 'application/json',}
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log("schemes to set",result);
    const res= await result[0];
    return res;
  }*/
  const [pollingError,setPollingError] = useState()
  const [defaultScheme, setDefaultScheme] = useState(()=>{
    if (typeof window !== 'undefined') {
      logger.info("Setting up default scheme")
    try{
      const storedScheme = localStorage.getItem('defaultScheme');
      if(storedScheme){
        logger.info("set up default scheme from local storage",storedScheme)
        return JSON.parse(storedScheme)}
      } catch (err) 
      {logger.error("error setting scheme",err.message)
        return null}
  }})
/*
useEffect(()=>{
  {const fetchDefault=async () => {
      try{
      const storedScheme = localStorage.getItem('defaultScheme');
      console.log("stored",storedScheme)
      let res;
    if (storedScheme) {res=JSON.parse(storedScheme);
      console.log("stored len",Object.keys(res))
      if (Object.keys(res).length>0) {
        console.log("set",res)
        setDefaultScheme (res);
      }
    } 
    res=await fetchScheme()
    console.log("set",res)
    return res;}
    catch(err){
      console.log("error",err.message)
      return null}
  }
  fetchDefault()
  }
},[])*/
useEffect(() => {
  if (defaultScheme !== null) {
    localStorage.setItem('defaultScheme', JSON.stringify(defaultScheme));
    logger.info("putting default scheme into local storage",defaultScheme)
  }
}, [defaultScheme]);
logger.info("default scheme befor return",defaultScheme)
  return (
    <GlobalContext.Provider value={{ defaultScheme, setDefaultScheme, pollingError,setPollingError }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};
