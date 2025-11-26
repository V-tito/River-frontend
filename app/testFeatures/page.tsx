"use client";
import { useGlobal } from '../GlobalState';
const Test = ()=> {
    const { defaultScheme } = useGlobal();
    return (<div>{defaultScheme}</div>)
}
export default Test