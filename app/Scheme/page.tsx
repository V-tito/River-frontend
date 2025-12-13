"use client";
import React, { useEffect, useState } from 'react';
import DataView from "../../components/dataView";
import AddDeleteWrapper from "../../components/addDeleteWrapper";

const Schemelist = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/Scheme`,{
          method: 'GET',
          //headers: {'Content-Type': 'application/json',}
        });
        if (!response.ok) {
          throw new Error(`Ошибка сети ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
      }
      
    } finally {
      setLoading(false);
    };
    }
    fetchData();
}, []); 
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <AddDeleteWrapper table="Scheme" listOfAll={data}>
                     <h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
                Список схем:</h1>
      <DataView data={data} kind="Scheme"></DataView>
      </AddDeleteWrapper>
  );
};

export default Schemelist;