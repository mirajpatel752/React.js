import React from 'react'
import { Modal, ModalBody } from 'reactstrap'
import CustomButton from '../custom_field/CustomButton'
import image from '../../assets/images/success-model.svg'

export default function ConnectionModel({ connectionPopUpActive, handleConnectionPopUp, primaryLabel, secondaryLabel }) {
    return (
        <Modal autoFocus={false} isOpen={connectionPopUpActive} toggle={() => { }} className='modal-dialog-centered munim-connection-model'>
            <ModalBody className='munim-connection-model-body'>
                <div className='munim-connection-image'>
                    <img src={image} />
                </div>
                <h2>Flipkart Connection successfully</h2>
                <p>Thank you for new connection</p>
                <div className='munim-connection-button'>
                    <CustomButton type='button' color='primary' handleClick={() => handleConnectionPopUp(true)} autoFocus label={primaryLabel} />
                    <CustomButton outline type='button' color='secondary' handleClick={() => handleConnectionPopUp(false)} label={secondaryLabel} />
                </div>
            </ModalBody>
        </Modal>
    )
}
