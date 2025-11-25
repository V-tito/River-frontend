"use client"
import React, { useEffect, useState } from 'react';
import StateTable from "../../components/state_table";
import { useGlobal } from '../GlobalState';
interface MyDataType {
  id: number;
  name: string;
  // Add other fields as necessary
}
interface DynamicRecord {
  [key: string]: []; // Change 'any' to a more specific type if possible
}

const StateOfSignals = () => {
  const {defaultScheme}=useGlobal()
    const [data, setData] = useState<DynamicRecord>({});
      const [groups, setGroups] = useState<[MyDataType]|[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        const fetchGroups = async () => {
        try {
        const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/GroupOfSignals/${defaultScheme.id}`,{
          method: 'GET',// headers: new Headers({'Content-Type': 'application/json'})
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
      }
    }
    }
    
    const fetchSignals = async (groupId:number)=>{
      try {
        const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/Signal/byGroup/${groupId}`,{
          method: 'GET',// headers: new Headers({'Content-Type': 'application/json'})
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
    
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
      }
    }
    }
    const fetchAll=async()=>{
    const newGroups=await fetchGroups()
    
    if (newGroups.length>0){
    const promises=newGroups.map( async (group:MyDataType) => {
      const temp= await fetchSignals(group.id)
      return { name:String(group.name), temp }
    })
    const results=await Promise.all(promises)
    
    const newData=results.reduce((acc, { name, temp }) => {
      acc[name] = temp;
      return acc;
    }, {} as DynamicRecord);
    setData(newData)
    setGroups(newGroups)
    }
    }
    fetchAll();
    setLoading(false);},[defaultScheme])

    if (loading) return (<p>Loading...</p>)
    if (error) return <p>Error: {error.message}</p>
    return (<div>{groups.map(group => (
        <div key={group.id} className='w-full h-min'><h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Состояние сигналов группы {group.name}:</h1>
            <StateTable data={data[group.name]}></StateTable></div>))}</div>)
}
export default StateOfSignals