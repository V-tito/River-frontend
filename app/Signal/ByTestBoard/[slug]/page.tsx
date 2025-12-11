"use client";
import React, { useEffect, useState } from 'react';
//import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
//import Filter from "../../../components/filter";
import AddDeleteWrapper from "../../../../components/addDeleteWrapper";
import DataView from "../../../../components/dataView";

const SignalList = () => {
  const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const params = useParams(); // Get URL parameters
    let slug;
    if (params) { slug  = params.slug;} else{slug='1'}

   useEffect(() => {
    const fetchData = async () => {
    try {
    const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/Signal/byTestBoard/${slug}`,{
      method: 'GET',
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

}, [ slug,params ]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

  return (
    <AddDeleteWrapper table="Signal" listOfAll={data}>
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-10 text-black dark:text-zinc-50">
                Список сигналов платы {slug}:</h1>
            <DataView data={data} kind="Signal"></DataView>
    </AddDeleteWrapper>
  );
};

export default SignalList;

