"use client";
import React, { useEffect, useState } from 'react';
import DataTable from "../../components/table-builder";
import AddForm from "../../components/add_form";
import DeleteForm from "../../components/delete_form";
//import Filter from "../../components/filter";

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
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <AddForm table="Scheme"></AddForm>
            <DeleteForm table="Scheme"></DeleteForm>
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Список схем:</h1>
      
      <DataTable data={data}></DataTable>
      </div>
  );
};

export default Schemelist;