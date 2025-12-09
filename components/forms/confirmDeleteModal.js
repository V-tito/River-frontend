import React, { useEffect, useState } from 'react';
import styles from "./modal.module.css"
import Popup from 'reactjs-popup';
//import 'reactjs-popup/dist/index.css';
import Modal from "../modal"

const ConfirmDeleteModal = ({ state, setState }) => {
  const [isVisible, setIsVisible]=useState(null)
  const [error,setError]=useState(null)

  useEffect(()=>{setIsVisible(state!=null)},[state])

  const onClose = ()=>{
    setIsVisible(null)
    setState(null)
  }

  const onConfirm=async (e) => {
    e.preventDefault();      
        try {
            const response = await fetch(state,{
              method: 'DELETE',//headers: {'Content-Type': 'application/json',}
            });
            console.log(state)
            if (!response.ok) {
              throw new Error(`Ошибка сети: ${response.status}`);
            }
            onClose()
            window.location.reload();
          } catch (err) {
            if (err instanceof Error) {
                setError(err)
                console.log (`Error: ${err.message}`)

          }
         
        }
       
    }

  //if (!isVisible) return null;

  return (
    <Popup open={isVisible} onClose={onClose}>
          <div className={styles.modalOverlayStyle}>
            <div className={styles.header}> Подтверждение действия </div>
            <div className={styles.modalContentStyle}>
              Удаление этого элемента повлечет удаление всех зависящих от него элементов. Вы уверены, что хотите продолжить?
            </div>
            <div className="actions">
        <button onClick={onConfirm} className={styles.closeButtonStyle}>Подтвердить</button>
        <button onClick={onClose} className={styles.closeButtonStyle}>Отменить</button>
        <Modal state={error}>{error? error.message : ""}</Modal>
            </div>
          </div>
      </Popup>
  );
};

// Sample styles for the modal


export default ConfirmDeleteModal;
