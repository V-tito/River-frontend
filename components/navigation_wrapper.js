"use client"
//import //logger from "..///logger";
import styles from './navigation_wrapper.module.css';  // Import the CSS module for styling
import NavigationBar from './navigation-bar';
import ErrorIndicatorBar from './ErrorIndicatorBar';
import { usePathname } from 'next/navigation';
import {useGlobal} from '../app/GlobalState'
const NavigationWrapper = ({ children }) => {
  const{defaultScheme,pollingError}=useGlobal()
  //here i got to get page name
  const pathname=usePathname()
  const pathSegments = pathname.split('/');
    const pagename = pathSegments[pathSegments.length - 1];
    //logger.debug("pagename",pagename)
  return (
    <div className={styles.navigation_wrapper}>
      <aside className={styles.sidebar}>
        <NavigationBar></NavigationBar>
        <div className={styles.currentScheme}><p>Текущая схема: {defaultScheme==null ? "не задана": defaultScheme.name}</p></div>
      {pagename=="StateOfSignals"?<ErrorIndicatorBar err={pollingError} table="signals"></ErrorIndicatorBar>:''}
      {pagename=="StateOfBoards"?<ErrorIndicatorBar err={pollingError} table="boards"></ErrorIndicatorBar>:''}
      </aside>
      <main className={styles.main}>
        {children} 
      </main>
    </div>
  );
};

export default NavigationWrapper;