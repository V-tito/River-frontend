"use client";
import React, { useEffect, useState } from 'react';
import AddDeleteWrapper from "../../components/AddDeleteWrapper";
import DataTable from "../../components/table-builder";
interface MyDataType {
  id: number;
  name: string;
  // Add other fields as necessary
}
interface DynamicRecord {
  [key: string]: []; // Change 'any' to a more specific type if possible
}
const SignalList = () => {
  const [data, setData] = useState<DynamicRecord>({});
  const [groups, setGroups] = useState<[MyDataType]|[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const[listForDel,setListForDel]=useState([])


   useEffect(() => {
    const fetchGroups = async () => {
    try {
    const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/GroupOfSignals/${process.env.defaultScheme}`,{
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
const newList=results.reduce((acc, { name, temp }) => {
  acc.push(temp);
  return acc
}, [])
setData(newData)
setGroups(newGroups)
setListForDel(newList)
}
}
fetchAll();
setLoading(false);},[])

useEffect(() => {

}, []);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  console.log('lfd',listForDel)
  return (
    //
    <AddDeleteWrapper table="Signal" listOfAll={listForDel ?? [[{id:null,name:"none"}]]}>
    {groups.map(group => (
            <div key={group.id}><h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Список сигналов группы {group.name}:</h1>
                <DataTable data={data[group.name]}></DataTable></div>))}
                </AddDeleteWrapper>
  );
};

export default SignalList;