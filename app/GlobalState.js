"use client"
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
  const [defaultScheme, setDefaultScheme] = useState(null)
// Update localStorage whenever defaultScheme changes
useEffect(()=>{
  if (typeof window !== 'undefined') {
  try{
    const storedScheme = localStorage.getItem('defaultScheme');
    if(storedScheme){setDefaultScheme(JSON.parse(storedScheme))}
    } catch (err) 
    { console.log("error setting scheme",err.message)
      return null}
}},[])
/*useEffect(()=>{
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
    console.log("default scheme was set",defaultScheme)
    localStorage.setItem('defaultScheme', JSON.stringify(defaultScheme));
  }
}, [defaultScheme]);
console.log("def",defaultScheme)
  return (
    <GlobalContext.Provider value={{ defaultScheme, setDefaultScheme }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};
