"use client";
import React, { useEffect, useState } from 'react';
//import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
//import Filter from "../../../components/filter";
import AddForm from "../../../components/add_form";
import DeleteForm from "../../../components/delete_form";
import DataTable from "../../../components/table-builder";

const BoardList = () => {
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
console.log(`${process.env.API_URL}/api/river/v1/configurator/TestBoard/${slug}`)

}, [ slug,params ]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

  return (
    //
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <AddForm table="TestBoard"></AddForm>
            <DeleteForm table="TestBoard"></DeleteForm>
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Список плат схемы {slug}:</h1>
      
            <DataTable data={data}></DataTable>
    </div>
  );
};

export default BoardList;