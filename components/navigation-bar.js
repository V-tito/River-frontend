"use client"
import { useEffect, useState } from 'react';
import styles from "./navigation.module.css";
import Link from 'next/link';

const NavigationBar = () => {
  const [config, setConfig] = useState(JSON.parse('[{"id":0,"name":"Главная","link":"/"}]'));
  
  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch('/api/getNavigationConfig');
      const data = await response.json();
      setConfig(data);
    };

    fetchConfig();
  }, []);

  console.log(config)
  if (config == null) setConfig(JSON.parse('{"id":0,"name":"Home","link":"/"}'));
  console.log(config)

    return (<nav className={styles.nav}>
        <ul>
            {config.map((item) => (
                <li key={item.id}><Link href={item.link}>{item.name}</Link></li>
              ))}
        </ul>
      </nav>)
}
export default NavigationBar