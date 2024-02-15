import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import CustomButton from '../custom_field/CustomButton'

export default function WarningModal({ popUpTitle, popUpContent, WarningPopUpActive, handleWarningPopUp, secondaryLabel, primaryLabel, showToggle = true }) {
    return (
        <Modal autoFocus={false} isOpen={WarningPopUpActive} toggle={showToggle && handleWarningPopUp} className='modal-dialog-centered'>
            <ModalHeader toggle={showToggle && handleWarningPopUp}>{popUpTitle}</ModalHeader>
            <ModalBody>{popUpContent}</ModalBody>
            <ModalFooter>
                <CustomButton outline type='button' color='secondary' handleClick={() => handleWarningPopUp()} label={secondaryLabel} tabIndex="-1" />
                <CustomButton type='button' color='warning' handleClick={() => handleWarningPopUp('', true)} autoFocus label={primaryLabel} />
            </ModalFooter>
        </Modal>
    )
}
