"use client";
import React, { useEffect, useState } from 'react';
//import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
//import Filter from "../../../components/filter";
import AddForm from "../../../components/add_form";
import DeleteForm from "../../../components/delete_form";
import DataTable from "../../../components/table-builder";
import NavigationWrapper from "../../../components/navigation_wrapper"
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
    const response = await fetch(`/api/river/v1/configurator/TestBoard/${slug}`,{
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
console.log(`/api/river/v1/configurator/TestBoard/${slug}`)

}, [ slug,params ]);
    
    /*useEffect(() => {
      
      const fetchData = async () => {
        try {
          //const route = router.query.slug ? `/api/board${router.query.slug}` : `/api/board`
          const response = await fetch('api/board',{
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
  }, []); // Empty dependency array means this runs once on component mount*/
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

  return (
    //
    <NavigationWrapper>
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <AddForm table="TestBoard"></AddForm>
            <DeleteForm table="TestBoard"></DeleteForm>
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Список плат схемы {slug}:</h1>
      
            <DataTable data={data}></DataTable>
    </div>
    </NavigationWrapper>
  );
};

export default BoardList;