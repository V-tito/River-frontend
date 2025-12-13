"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AddDeleteWrapper from "../../../components/addDeleteWrapper";
import DataView from "../../../components/dataView";
import { useGlobal } from '@/app/GlobalState';

const BoardList = () => {
   const defaultScheme=useGlobal()
  const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const params = useParams(); // Get URL parameters
    let slug;
    if (params) { slug  = params.slug;} else{slug='1'}

   useEffect(() => {
    const fetchData = async () => {
    try {
    const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/TestBoard/${slug}`,{
      method: 'GET',// headers: new Headers({'Content-Type': 'application/json'})
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
console.log(`${process.env.API_URL}/api/river/v1/configurator/TestBoard/${slug}`)

}, [ slug,params,defaultScheme ]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

  return (
    //
          <AddDeleteWrapper table="TestBoard" listOfAll={data}>
                        <h1 className="w-full text-3xl font-semibold leading-tight tracking-10 text-black dark:text-zinc-50 text-left">
                Список плат:</h1>
            <DataView data={data} kind="TestBoard"></DataView>
            </AddDeleteWrapper>
  );
};

export default BoardList;