import styles from './navigation_wrapper.module.css';  // Import the CSS module for styling
import NavigationBar from './navigation-bar';
import SetDefaultScheme from "./forms/set_default_scheme_form"
const NavigationWrapper = ({ children }) => {
  return (
    <div className={styles.navigation_wrapper}>
      <aside className={styles.sidebar}>
        <NavigationBar></NavigationBar>
        <SetDefaultScheme></SetDefaultScheme>
      </aside>
      <main className={styles.main}>
        {children} 
      </main>
    </div>
  );
};

export default NavigationWrapper;