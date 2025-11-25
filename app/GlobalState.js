"use client"
import React, { createContext, useContext, useState,useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [defaultScheme, setDefaultScheme] = useState(() => {
    try{
    const storedScheme = localStorage.getItem('defaultScheme');
    console.log(storedScheme)
  return storedScheme ? JSON.parse(storedScheme) : null;}
  catch(err){return null}
});

// Update localStorage whenever defaultScheme changes
useEffect(() => {
  if (defaultScheme !== null) {
    console.log(defaultScheme)
    localStorage.setItem('defaultScheme', JSON.stringify(defaultScheme));
  }
}, [defaultScheme]);

  return (
    <GlobalContext.Provider value={{ defaultScheme, setDefaultScheme }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};
