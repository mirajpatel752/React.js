/* eslint-disable no-use-before-define */
import { useFormik } from 'formik'
import React from 'react'
import { Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import * as yup from 'yup'
import ValidationMessage from '../Validation'
import CustomButton from '../custom_field/CustomButton'
import InputTextField from '../custom_field/InputTextField'
import MultipleRadioButton from '../custom_field/MultipleRadioButton'
import MultiSelectWithData from '../custom_field/MultiSelectWithData'

const CustomReportModal = ({ isOpen, handleModal, sharedUserList, saveLoader }) => {
    const entryDateSchema = yup.object().shape({
        filter_name: yup.string()
            .required(ValidationMessage.is_require),
        shared_with_user: yup.mixed()
            .when('visibility_preference', {
                is: visibility_preference => visibility_preference === 2,
                then: yup.mixed()
                    .test({
                        message: ValidationMessage.is_require,
                        test: (value) => value && value.length
                    })
            })
    })
    const formik = useFormik({
        initialValues: {
            filter_name: '',
            visibility_preference: 0,
            shared_with_user: []
        },
        validationSchema: entryDateSchema,
        enableReinitialize: true,
        onSubmit: (value) => {
            handleModal(true, value)
        }
    })
    const handleSelectUser = (name, value) => {
        formik.setFieldValue(name, value)
    }
    return (
        <div>
            <Modal isOpen={isOpen} className='modal-dialog-centered'>
                <ModalHeader toggle={() => handleModal(false)}>Save as custom report</ModalHeader>
                <ModalBody>
                    {/* <Card> */}
                    <Row>
                        <Col className='mb-1'>
                            <div className=' position-relative'>
                                <InputTextField
                                    value={formik.values.filter_name}
                                    placeholder='Enter name'
                                    name='filter_name'
                                    label='Name'
                                    handleChange={formik.setFieldValue}
                                    handleBlur={formik.setFieldTouched}
                                    errors={formik.errors.filter_name}
                                    touched={formik.touched.filter_name}
                                    autoComplete='off'
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='mb-1'>
                            <Label for='Visibility preference'>
                                Visibility preference
                            </Label>
                            <MultipleRadioButton
                                name='visibility_preference'
                                label={['Only Me', 'Everyone', 'Only selected users']}
                                handleChange={formik.setFieldValue}
                                value={formik.values.visibility_preference}
                            />
                        </Col>
                    </Row>
                    {formik.values.visibility_preference === 2 && <>
                        <Row>
                            <Col className='mb-1 position-relative'>
                                <div className='position-relative'>
                                    <Label for='Select users'>
                                        Select users
                                    </Label>
                                    <MultiSelectWithData
                                        option={sharedUserList}
                                        handleChange={handleSelectUser}
                                        name='shared_with_user'
                                        errors={formik.errors.shared_with_user}
                                        handleBlur={formik.setFieldTouched}
                                        touched={formik.touched.shared_with_user}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </>}
                    {/* </Card> */}
                </ModalBody>
                <ModalFooter>
                    <div className='d-flex justify-content-between'>
                        <div className='default-button'>
                            <CustomButton className='me-1' color='primary' type='button' disabled={!formik.dirty} handleClick={formik.handleSubmit} label='Save' loader={saveLoader} />
                            <CustomButton className='me-1' outline color='secondary' type='button' handleClick={() => handleModal(false)} label='Cancel' />
                        </div>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default CustomReportModal

