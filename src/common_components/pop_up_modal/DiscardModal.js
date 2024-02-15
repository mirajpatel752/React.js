import React, { useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import CustomButton from '../custom_field/CustomButton'

export default function DiscardModal({ popUpTitle, popUpContent, discardPopUpActive, handleDiscardPopUp, primaryLabel, secondaryLabel }) {
  useEffect(() => {
    if (discardPopUpActive) {
      setTimeout(() => {
        document.getElementsByClassName('munim-discard-modal')[0].parentElement.style = 'position: relative; z-index: 2000000001; display: block;'
      }, 100)
    }
  }, [discardPopUpActive])
  return (
    <>
      <Modal wrapClassName='munim-discard-modal' autoFocus={false} isOpen={discardPopUpActive} toggle={() => handleDiscardPopUp()} className='modal-dialog-centered'>
        <ModalHeader toggle={() => handleDiscardPopUp()}>{popUpTitle}</ModalHeader>
        <ModalBody>{popUpContent}</ModalBody>
        <ModalFooter>
          <CustomButton outline type='button' autoFocus={true} color='secondary' handleClick={() => handleDiscardPopUp()} label={secondaryLabel} />
          <CustomButton type='button' color='primary' handleClick={() => handleDiscardPopUp(true)} label={primaryLabel} />
        </ModalFooter>
      </Modal>
    </>
  )
}
