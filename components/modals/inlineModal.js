import React, { useEffect, useState } from 'react';
import styles from "./modal.module.css"
import PropTypes from 'prop-types';
const Modal = ({ state, children }) => {
  const [isVisible, setIsVisible]=useState(false)

  useEffect(()=>{setIsVisible(state!=null)},[state])

  const onClose = ()=>{
    setIsVisible(false)
  }
  if (!isVisible) return null;

  return (
    <div className={styles.containerInline}>
        {children}
        <button onClick={onClose} className={styles.closeButton}>Закрыть</button>
    </div>
  );
};
Modal.propTypes={
  state:PropTypes.any,
  children:PropTypes.node
}
export default Modal;
