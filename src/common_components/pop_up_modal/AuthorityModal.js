import React, { useEffect } from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'

export default function AuthorityModal({ popUpTitle, popUpContent, authorityPopUpActive, popUpContent2, handleSetPasswordPopUp }) {
    useEffect(() => {
        if (authorityPopUpActive) {
            setTimeout(() => {
                document.getElementsByClassName('munim-discard-modal')[0].parentElement.style = 'position: relative; z-index: 2000000001; display: block;'
            }, 100)
        }
    }, [authorityPopUpActive])
    return (
        <Modal wrapClassName='munim-discard-modal' autoFocus={false} isOpen={authorityPopUpActive} toggle={() => handleSetPasswordPopUp()} className='modal-dialog-centered'>
            <ModalHeader toggle={() => handleSetPasswordPopUp()}>{popUpTitle}</ModalHeader>
            <ModalBody>{popUpContent}<Button outline className='munim-button-link-none munim-display-contents' onClick={() => handleSetPasswordPopUp(1)}>{popUpContent2}</Button></ModalBody>
        </Modal>
    )
}
