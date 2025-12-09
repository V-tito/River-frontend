"use client";
//import //logger from "../../..///logger";
import React, { useEffect, useState } from 'react';
//import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
//import Filter from "../../../components/filter";
import AddDeleteWrapper from "../../../components/AddDeleteWrapper";
import { useGlobal } from '@/app/GlobalState';
import DataTiles from "../../../components/tiles-group"

const GroupList = () => {
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
      //logger.debug("signals page: before fetch from api"+`${process.env.API_URL}/api/river/v1/configurator/GroupOfSignals/${slug}`)
    const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/GroupOfSignals/${slug}`,{
      method: 'GET',// headers: new Headers({'Content-Type': 'application/json'})
    });
    if (!response.ok) {
      throw new Error (`Ошибка сети ${response.status}`)
    }
    const result = await response.json();
    setData(result);
    //logger.debug("signals page: set data")
        //logger.debug(result)
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err);
      //logger.debug(`groups page: network error caught ${err.message}`)
  } else{
    //logger.debug(`groups page: unknown exception on signals page`)
    }
  } finally {
    //logger.debug("groups page: finished loading")
  setLoading(false);
};
}
//logger.debug(`groups page: trying to fetch data for scheme ${slug}`)
fetchData();

}, [ slug,params ]);
//logger.info(`groups page:entered for scheme ${slug}`)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

  return (
    //
    <AddDeleteWrapper table="GroupOfSignals" listOfAll={data}>
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Список групп сигналов схемы {defaultScheme.name}:</h1>
            <DataTiles  data={data}></DataTiles>
    </AddDeleteWrapper>
  );
};

export default GroupList;