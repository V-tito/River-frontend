"use client";
//import //logger from "../..///logger";
import React, { useEffect, useState } from 'react';
import AddDeleteWrapper from "../../components/AddDeleteWrapper";
import DataTiles from "../../components/tiles-signal";
//<DataTiles data={data[group.name]}></DataTiles>
import DataTable from '@/components/table-builder';
import { useGlobal } from '../GlobalState';
interface MyDataType {
  id: number;
  name: string;
  // Add other fields as necessary
}
interface DynamicRecord {
  [key: string]: []; // Change 'any' to a more specific type if possible
}
const SignalList = () => {
  const { defaultScheme } = useGlobal();
  const [data, setData] = useState<DynamicRecord>({});
  const [groups, setGroups] = useState<[MyDataType]|[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const[listForDel,setListForDel]=useState([])


   useEffect(() => {
    const fetchData=async()=>{
      try{
        //logger.debug("signals page: before fetch from api"+`/api/getSignalTables/${defaultScheme.id}`)
      const response=await fetch(`/api/getSignalTables/${defaultScheme.id}`)
      const conf = await response.json();
        if (!response.ok){
          throw new Error (`Ошибка сети ${response.status}`)
        }
        setData(conf.data)
        //logger.debug("signals page: set data")
        //logger.debug(conf.data)
      setGroups(conf.groups)
      //logger.debug("signals page: set groups")
      //logger.debug(conf.groups)
      setListForDel(conf.list)
      //logger.debug("signals page: set list for delete form with")
      //logger.debug(conf.list)
      
    } catch (err:unknown){
      if (err instanceof Error) {
        setError(err)
        //logger.debug(`signals page: network error caught ${err.message}`)
      } else{
      //logger.debug(`signals page: unknown exception on signals page`)
      }
    } finally {
      //logger.debug("signals page: finished loading")
      setLoading(false)}}
    //logger.debug("signals page: trying to fetch data for scheme",defaultScheme)
    fetchData()
  },[defaultScheme])

  //logger.info("signals page:entered for scheme",defaultScheme)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    //logger.debug('groups fetched on signals page')
    //logger.debug(groups)
    //logger.debug('signals fetched on signals page')
    //logger.debug(data)
    //logger.debug('list for delete form on signals page')
    //logger.debug(listForDel)
  return (
    //
    <AddDeleteWrapper table="Signal" listOfAll={listForDel ?? [[{id:null,name:"none"}]]}><div>
    {groups.map(group => (
            <div key={group.id} className='w-full h-min'><h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Список сигналов группы {group.name}:</h1>
                <DataTiles data={data[group.name]}></DataTiles>
                </div>
              ))}</div>
                </AddDeleteWrapper>
  );
};

export default SignalList;