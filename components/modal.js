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
    <div style={styles.modalOverlayStyle}>
      <div style={styles.modalContentStyle}>
        <button onClick={onClose} style={styles.closeButtonStyle}>Закрыть</button>
        {children}
      </div>
    </div>
  );
};

// Sample styles for the modal


export default Modal;
