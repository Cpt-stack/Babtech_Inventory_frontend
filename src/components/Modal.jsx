import React from "react";
import styles from "./css/Modal.module.css";

function Modal({ isOpen, type = "error", title, message, image, onClose, closeText = "Close" }) {
    if (!isOpen) return null;

    const isError = type === "error";

    return (
        <div
            className={styles.overlay} onClick={onClose} >
            <div
                className={styles.modalCard} role="alertdialog" aria-modal="true" aria-labelledby="modal-title"aria-describedby="modal-message"
                onClick={(e) => e.stopPropagation()}>

                {image && ( <img src={image} alt="" className={styles.modalImage}/> )}

                <h2 id="modal-title" className={`${styles.modalTitle} ${isError ? styles.errorTitle : styles.successTitle }`}>
                    {title || (isError ? "Something went wrong" : "Successful")}
                </h2>

                {message && (
                    <p id="modal-message"className={styles.modalMessage}>{message} </p>)}

                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    {closeText}
                </button>
            </div>
        </div>
    );

}

export default Modal;