"use client";
import React, { useEffect, useState } from 'react';
import DataTable from "../../components/table-builder";

const Platelist = () => {
  const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://ll.thespacedevs.com/2.2.0/agencies/?limit=30',{
            method: 'GET'
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
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
  }, []); // Empty dependency array means this runs once on component mount
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex min-h-screen max-w-none items-center justify-left bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Список плат:</h1>
      
            <DataTable datar={data}></DataTable>
    </div>
    </main>
      </div>
  );
};

export default Platelist;