import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import CustomButton from '../custom_field/CustomButton'

export default function LeavePageModel({ popUpTitle, popUpContent, leavePagePopUpActive, handleLeavePopUp, primaryLabel, secondaryLabel }) {
    return (
        <Modal autoFocus={false} isOpen={leavePagePopUpActive} toggle={() => handleLeavePopUp()} className='modal-dialog-centered'>
            <ModalHeader toggle={() => handleLeavePopUp()}>{popUpTitle}</ModalHeader>
            <ModalBody>{popUpContent}</ModalBody>
            <ModalFooter>
                <CustomButton outline type='button' color='secondary' handleClick={() => handleLeavePopUp()} label={secondaryLabel} />
                <CustomButton type='button' color='warning' handleClick={() => handleLeavePopUp(true)} autoFocus label={primaryLabel} />
            </ModalFooter>
        </Modal>
    )
}
