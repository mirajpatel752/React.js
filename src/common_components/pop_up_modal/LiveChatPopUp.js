import React, { } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import CustomButton from '../custom_field/CustomButton'

export default function DiscardModal({ popUpTitle, popUpContent, liveChatPopUpActive, handleLiveChatPopUp, primaryLabel, secondaryLabel }) {

    return (
        <>
            <Modal wrapClassName='munim-discard-modal' autoFocus={false} isOpen={liveChatPopUpActive} toggle={() => handleLiveChatPopUp()} className='modal-dialog-centered'>
                <ModalHeader toggle={() => handleLiveChatPopUp()}>{popUpTitle}</ModalHeader>
                <ModalBody>{popUpContent}</ModalBody>
                <ModalFooter>
                    <CustomButton outline type='button' color='secondary' handleClick={() => handleLiveChatPopUp()} label={secondaryLabel} />
                    <CustomButton type='button' color='primary' autoFocus={true} handleClick={() => handleLiveChatPopUp(true)} label={primaryLabel} />
                </ModalFooter>
            </Modal>
        </>
    )
}
