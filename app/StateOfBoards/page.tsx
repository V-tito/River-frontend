"use client";
import { useEffect, useState } from 'react';
import StateTable from '@/components/state_table';
import { useGlobal } from '../GlobalState';

  

const StateOfPlates = () => {
    const { defaultScheme } = useGlobal();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

   useEffect(() => {
    const fetchBoards = async () => {
    try {
    const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/TestBoard/${defaultScheme.id}`,{
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
fetchBoards();
}, [defaultScheme]);
    
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