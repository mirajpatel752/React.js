import React, { useEffect } from 'react'
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap'
import * as Icon from 'react-feather'
import CustomButton from '../custom_field/CustomButton'

export default function DeleteModal({ popUpTitle, popUpContent, deletePopUpActive, handleDeletePopUp, primaryLabel, loader, secondaryLabel, popUpContent2 }) {
    useEffect(() => {
        if (deletePopUpActive) {
            setTimeout(() => {
                document.getElementsByClassName('munim-discard-modal')[0].parentElement.style = 'position: relative; z-index: 2000000001; display: block;'
            }, 100)
        }
    }, [deletePopUpActive])
    return (
        <Modal wrapClassName='munim-discard-modal' autoFocus={false} isOpen={deletePopUpActive} toggle={() => handleDeletePopUp(false)} className='modal-dialog-centered'>
            <ModalHeader toggle={() => handleDeletePopUp(false)}>{popUpTitle}</ModalHeader>
            <ModalBody>{popUpContent}</ModalBody>
            {popUpContent2 ? <Alert color='warning' className='m-1 mt-0'>
                <div className='alert-body d-flex align-items-center'>
                    <Icon.AlertCircle size={40} />
                    <span className='ms-50'>{popUpContent2}</span>
                </div>
            </Alert> : ''}
            <ModalFooter>
                <CustomButton outline type='button' color='secondary' handleClick={() => handleDeletePopUp(false)} label={secondaryLabel} />
                <CustomButton type='button' color='danger' handleClick={() => handleDeletePopUp(true)} autoFocus label={loader ? <Spinner size='sm' color='primary' /> : primaryLabel} />
            </ModalFooter>
        </Modal>
    )
}
