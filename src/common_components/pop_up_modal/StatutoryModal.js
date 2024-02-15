import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import BasicAlert from '../BasicAlert'
import CustomButton from '../custom_field/CustomButton'

export default function StatutoryModal({ popUpTitle, discardPopUpActive, handleDiscardPopUp, secondaryLabel, primaryLabel }) {
    return (
        <>
            <Modal size='lg' autoFocus={false} isOpen={discardPopUpActive} className='modal-dialog-centered'>
                <ModalHeader>{popUpTitle}</ModalHeader>
                <ModalBody>
                    <BasicAlert hideAlertIcon={true} type='info' message='<div><p>What is Statutory information?</p><p><ul><li>GST registered company required GST reports and  vendor details with GST.</li><li>TDS registered company, user required to view TDS related reports.</li><li>TCS registered company, user required to view TCS related reports.</li></ul></p></div>' />
                    <b>Note:</b>{' Later On, you can able to enable those settings from "Settings > Statutory information."'}
                </ModalBody>
                <ModalFooter>
                    <CustomButton outline type='button' color='secondary' handleClick={() => handleDiscardPopUp()} label={secondaryLabel} />
                    <CustomButton type='button' color='primary' handleClick={() => handleDiscardPopUp(true)} autoFocus label={primaryLabel} />
                </ModalFooter>
            </Modal>
        </>
    )
}
