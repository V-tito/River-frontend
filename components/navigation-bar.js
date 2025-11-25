"use client"
import { useEffect, useState } from 'react';
import styles from "./navigation.module.css";
import Link from 'next/link';
import { useGlobal } from '../app/GlobalState';

const NavigationBar = () => {
  const [config, setConfig] = useState(JSON.parse('{"common":[{"id":0,"name":"Главная","link":"/"}],"schemeDependent":[]}'));
  const {defaultScheme, setDefaultScheme}=useGlobal()
  
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
  

    return (<nav className={styles.nav}>
        <ul>
            {config.common.map((item) => (
                <li className={styles.li} key={item.id}><Link href={item.link}>{item.name}</Link></li>
              ))}
              {defaultScheme==null ? '':config.schemeDependent.map((item) => (
                <li className={styles.li} key={item.id}><Link href={item.link}>{item.name}</Link></li>
              ))}
        </ul>
      </nav>)
}
export default NavigationBar