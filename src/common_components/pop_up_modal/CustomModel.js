import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import CustomButton from '../custom_field/CustomButton'

export default function CustomModel({ popUpTitle, popUpContent, customPopUpActive, handleCustomPopUp, primaryLabel, secondaryLabel, loader }) {
    return (
        <Modal autoFocus={false} isOpen={customPopUpActive} toggle={() => handleCustomPopUp(false)} className='modal-dialog-centered'>
            <ModalHeader toggle={() => handleCustomPopUp(false)}>{popUpTitle}</ModalHeader>
            <ModalBody>
                <div dangerouslySetInnerHTML={{ __html: popUpContent }} />
            </ModalBody>
            <ModalFooter>
                <CustomButton outline type='button' color='secondary' handleClick={() => handleCustomPopUp(false)} label={secondaryLabel} />
                <CustomButton type='button' color='primary' handleClick={() => handleCustomPopUp(true)} autoFocus label={primaryLabel} loader={loader} />
            </ModalFooter>
        </Modal>
    )
}
