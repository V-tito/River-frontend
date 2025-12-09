"use client"
import { useEffect, useState } from 'react';
import styles from "./navigation.module.css";
import Link from 'next/link';
import { useGlobal } from '../app/GlobalState';
import { usePathname } from 'next/navigation';


const NavigationBar = () => {
  const [config, setConfig] = useState(JSON.parse('{"common":[{"id":0,"name":"Главная","link":"/"}],"schemeDependent":[]}'));
  const {defaultScheme}=useGlobal()
  const currentPath=usePathname()
  
  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch('/api/getNavigationConfig');
      const data = await response.json();
      console.log(data)
      setConfig(data);
      console.log(data)
    };

    fetchConfig();
  }, []);

 
  if (config == null) setConfig(JSON.parse('{"id":0,"name":"Home","link":"/"}'));
  

    return (<div className={styles.sidebar}><nav className={styles.nav}>
        <ul>
            {config.common.map((item) => (
                <li className={`${styles.li} ${item.link==currentPath||(item.link!='/'&&currentPath.includes(item.link))?styles.activeTab:''}`} key={item.id}><Link href={item.link}>{item.name}</Link></li>
              ))}
              {defaultScheme==null ? '':config.schemeDependent.map((item) => (<div key={item.id}>
                <li className={`${styles.li} ${currentPath.includes(item.link)?styles.activeTab:''}`} ><Link href={item.link}>{item.name}</Link></li>
                </div>
              ))}
        </ul>
        
      </nav>
      </div>)
}
export default NavigationBar