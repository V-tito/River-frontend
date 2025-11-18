import React, { useEffect, useState } from 'react';
import styles from "./modal.module.css"

const Modal = ({ state, children }) => {
  const [isVisible, setIsVisible]=useState(false)

  useEffect(()=>{setIsVisible(state!=null)},[state])

  const onClose = ()=>{
    setIsVisible(false)
  }
  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlayStyle}>
      <div className={styles.modalContentStyle}>
        <p>{children}</p>
        <button onClick={onClose} className={styles.closeButtonStyle}>Закрыть</button>
      </div>
    </div>
  );
};

// Sample styles for the modal


export default Modal;
