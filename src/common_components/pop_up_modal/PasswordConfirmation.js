import React, { useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText, Form, Label } from 'reactstrap'
import CustomButton from '../custom_field/CustomButton'
import InputPasswordToggle from '@components/input-password-toggle'
import InputPasswordField from '../custom_field/InputPasswordField'

const PasswordConfirmation = ({ passwordPopUpActive, handlePasswordPopup, popUpTitle, passwordMessage, currentPassword, handleSetPassword, loader, btn_color, label }) => {
    useEffect(() => {
        if (passwordPopUpActive) {
            setTimeout(() => {
                document.getElementById('password').focus()
            }, 100)
        }
    }, [passwordPopUpActive])
    return (
        <>
            <Modal isOpen={passwordPopUpActive} toggle={() => handlePasswordPopup()} className='modal-dialog-centered'>
                <ModalHeader toggle={() => handlePasswordPopup()}>{popUpTitle}</ModalHeader>
                <ModalBody>
                    <CardText className='mb-1'>
                        {passwordMessage}
                    </CardText>
                    <Form>
                        <div className="mb-1 position-relative munim-num-error">
                            <Label className="form-label required-star" for="Password">
                                Enter your current password to continue
                            </Label>
                            <InputPasswordToggle
                                placeholder="Password"
                                name="password"
                                value={currentPassword}
                                autoComplete="off"
                                onBlur={() => { }}
                                onChange={(e) => handleSetPassword('', e.target.value)}
                                className="input-group-merge"
                            />
                        </div>

                    </Form>
                </ModalBody>
                <ModalFooter>
                    <CustomButton outline type='button' color='secondary' handleClick={() => handlePasswordPopup()} label='Cancel' tabIndex="-1" />
                    <CustomButton type='button' loader={loader} disabled={!currentPassword?.length} color={btn_color} handleClick={() => handlePasswordPopup(true)} label={label} />
                </ModalFooter>
            </Modal>
        </>
    )
}

export default PasswordConfirmation