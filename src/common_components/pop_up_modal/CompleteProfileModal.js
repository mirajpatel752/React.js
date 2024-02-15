import React from 'react'
import { Modal, ModalBody, ModalHeader, Alert } from 'reactstrap'
import CustomButton from '../custom_field/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CommonRouter from '../../helper/commonRoute'
import { setCompleteProfile, setUserName } from '../../redux/commonSlice'

export default function CompleteProfileModel({ profilePopUpActive, setCompleteProfilePopup, popupActive }) {

    const history = useHistory()
    const dispatch = useDispatch()
    const user_data = useSelector((state) => state.commonReducer)
    const handleProfilePopUp = () => {
        setCompleteProfilePopup(false)
        dispatch(setCompleteProfile(false))
        dispatch(setUserName({ ...user_data, incomplete_user_profile: false }))
        popupActive(0)
    }
    const updateNow = () => {
        history.push(CommonRouter.profile)
        handleProfilePopUp()
    }
    return (
        <>
            <Modal autoFocus={false} isOpen={profilePopUpActive} className='modal-dialog-centered modal-import-file munim-modal-header-bg-unset'>
                <ModalHeader>Complete Your Profile</ModalHeader>
                <ModalBody className='p-1 pt-0'>
                    <div>
                        <Alert className='m-0 munim-alert-br-1 p-1'>
                            <div className='alert-body p-0 align-items-center'>
                                <p>We found your profile is just {user_data.profile_status}% completed, Please complete it.</p>
                                <p>So we can serve you better!!</p>
                            </div>
                            <div className='munim-complete-profile-popup'>
                                <CustomButton
                                    outline
                                    type='button'
                                    handleClick={() => handleProfilePopUp(false)}
                                    label='Remind Later'
                                    mobileBtnNone='munim-remind-later'
                                />
                                <CustomButton
                                    className='me-1'
                                    color='primary'
                                    type='button'
                                    handleClick={updateNow}
                                    label='Update Now!'
                                />
                            </div>
                        </Alert>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}