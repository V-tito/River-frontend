"use client";
import { useGlobal } from '../GlobalState';
import ErrorIndicatorBar from '../../components/ErrorIndicatorBar'
const Test = () => {
    const { defaultScheme } = useGlobal();
    return (<ErrorIndicatorBar></ErrorIndicatorBar>)
}
export default Test