"use client";
import React, { useEffect, useState } from 'react';
import DataTable from "../../components/table-builder";
//import Filter from "../../components/filter";
import NavigationWrapper from "../../components/navigation_wrapper"

const Schemelist = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/scheme',{
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
    //<Filter table="scheme"></Filter> goes lower when needed
    <NavigationWrapper>
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Список схем:</h1>
      
      <DataTable data={data}></DataTable>
      </div>
    </NavigationWrapper>
  );
};

export default Schemelist;