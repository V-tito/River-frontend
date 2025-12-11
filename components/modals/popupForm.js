"use client"
import Popup from 'reactjs-popup';
import styles from "./modal.module.css";
import "./popup.css"

const PopupForm = ({buttonLabel,children})=>{
    return (
        <Popup trigger={<button className={styles.menuButton} >
        {buttonLabel}
        </button>} closeOnDocumentClick={false}>
            {close => (<div  className={styles.container}>
                <button onClick={() => close()} className={styles.closeButton}>&times;</button>
                {children}
        </div>)}
        </Popup>)
}
export default PopupForm