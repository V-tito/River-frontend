"use client"
import styles from './navigation_wrapper.module.css';  // Import the CSS module for styling
import NavigationBar from './navigation-bar';
const NavigationWrapper = ({ children }) => {
  return (
    <div className={styles.navigation_wrapper}>
      <aside className={styles.sidebar}>
        <NavigationBar></NavigationBar>
      </aside>
      <main className={styles.main}>
        {children} 
      </main>
    </div>
  );
};

export default NavigationWrapper;