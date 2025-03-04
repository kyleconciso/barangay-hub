
import React, { useEffect } from 'react';
import styles from './Modal.css';
import Button from '../common/Button';

function Modal({ isOpen, onClose, children, title }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* stop propagation */}
                <div className={styles.modalHeader}>
                  <h2>{title}</h2>
                  <Button className={styles.closeButton} onClick={onClose}>
                    X
                  </Button>
                </div>
                <div className={styles.modalBody}>{children}</div>
            </div>
        </div>
    );
}

export default Modal;