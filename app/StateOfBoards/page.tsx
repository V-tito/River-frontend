"use client";
//import //logger from "../..///logger";
import { useEffect, useState } from 'react';
import StateTable from '@/components/state_table';
import { useGlobal } from '../GlobalState';

  

const StateOfPlates = () => {
    const { defaultScheme,setPollingError} = useGlobal();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

   useEffect(() => {
    const fetchBoards = async () => {
    try {
      //logger.debug("state of boards page: before fetch from api"+`${process.env.API_URL}/api/river/v1/configurator/TestBoard/${defaultScheme.id}`)
    const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/TestBoard/${defaultScheme.id}`,{
      method: 'GET',// headers: new Headers({'Content-Type': 'application/json'})
    });
    if (!response.ok) {
      throw new Error (`Ошибка сети ${response.status}`)
    }
    const result = await response.json();
    setData(result);
    //logger.debug("state of boards page:set data with")
    //logger.debug(result)
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err);
      setPollingError(err)
      //logger.debug(`state of  boards page: network error caught ${err.message}`)
  } else {
    //logger.debug(`state of  boards page: unknown exception`)
  }
  
} finally {
  //logger.debug("state of boards page: finished loading")
  setLoading(false);
};
}
//logger.debug("state of boards page: trying to fetch data for scheme",defaultScheme)
fetchBoards();
//logger.debug("state of boards page:fetching data finished")
}, [defaultScheme,setPollingError]);
//logger.info("state of boards page:entered for scheme",defaultScheme)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
  return (
    //
          <div>
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Состояние плат схемы {defaultScheme.name}:</h1>
            <StateTable data={data}></StateTable>
            </div>
  );
}
export default StateOfPlates