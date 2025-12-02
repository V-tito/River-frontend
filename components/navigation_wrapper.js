"use client"
import styles from './navigation_wrapper.module.css';  // Import the CSS module for styling
import NavigationBar from './navigation-bar';
import ErrorIndicatorBar from './ErrorIndicatorBar';
import {useGlobal} from '../app/GlobalState'
const NavigationWrapper = ({ children }) => {
  const{sigPollingError}=useGlobal()
  //here i got to get page name
  const pagename=useParams()
  return (
    <div className={styles.navigation_wrapper}>
      <aside className={styles.sidebar}>
        <NavigationBar></NavigationBar>
        {pagename=="StateOfSignals"||pagename=="StateOfBoards"?<ErrorIndicatorBar err={sigPollingError}></ErrorIndicatorBar>:''}
      </aside>
      <main className={styles.main}>
        {children} 
      </main>
    </div>
  );
};

export default NavigationWrapper;