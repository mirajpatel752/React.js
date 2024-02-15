/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import Sidebar from '@components/sidebar'
import { Row, Col, Label, Card, CardBody } from 'reactstrap'
import CustomButton from '../../common_components/custom_field/CustomButton'
import InputTextField from '../../common_components/custom_field/InputTextField'
import Hotkeys from 'react-hot-keys'
import { useFormik } from 'formik'
import RadioButton from '../../common_components/custom_field/RadioButton'
import HelpTooltip from '../../common_components/tooltip/HelpTooltip'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { ApiCall } from '../../helper/axios'
import useNotify from '../../custom_hooks/useNotify'
import { handlePageRefresh } from '../../helper/commonFunction'

const CategorySidebar = ({ open, toggleSidebar, isActiveElement, filterValue }) => {
  const notify = useNotify()
  const [saveLoader, setSaveLoader] = useState(false)
  const [initialState] = useState({
    categories: '',
    types: '',
    categories_status: 1
  })

  const formik = useFormik({
    initialValues: initialState,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSave(values)
    }
  })
  /**
   * IW0110
   * This function is call on save categories and product types data
   */
  const handleSave = async (values) => {
    setSaveLoader(true)
    const header = { 'access-token': localStorage.getItem('access_token') }
    const data = {
      status: values.categories_status ? 1 : 0
    }
    if (isActiveElement === 'product_type') {
      data.types = values.types
    } else {
      data.categories = values.categories
    }
    const res = await ApiCall('POST', isActiveElement === 'product_type' ? CommonApiEndPoint.create_item_type : CommonApiEndPoint.create_category, data, header)
    if (res.data.status === 'success') {
      setSaveLoader(false)
      notify(res.data.message, 'success')
      formik.handleReset()
      window.removeEventListener("beforeunload", handlePageRefresh)
      toggleSidebar(true, false, res.data.data.row_data, isActiveElement, res.data.data.is_next)
    } else {
      setSaveLoader(false)
      formik.setSubmitting(false)
      notify(res.data.message, 'error')
    }
  }
  /**
   * IW0110
   * This function is call on short-cut key
   */
  const onKeyDown = (_, e) => {
    e.preventDefault()
    if ((e.altKey && e.ctrlKey && e.keyCode === 67) || e.key === 'Escape') {
      toggleSidebar(false, formik.dirty, '', isActiveElement)
    }
  }
  /**
   * IW0110
   * This function is call on reload on data to open pop-up
   */
  useEffect(() => {
    if (formik.dirty) {
      window.addEventListener("beforeunload", handlePageRefresh)
    } else {
      window.removeEventListener("beforeunload", handlePageRefresh)
    }
  }, [formik.dirty])

  useEffect(() => {
    if (isActiveElement === 'categories' && filterValue) formik.setFieldValue('categories', filterValue)
    else if (isActiveElement === 'product_type' && filterValue) formik.setFieldValue('types', filterValue)
  }, [filterValue])

  return (
    <Sidebar
      size='half'
      open={open}
      title={isActiveElement === 'product_type' ? 'Add Product Type' : 'Add Category'}
      wrapClassName='munim-sidebar'
      contentClassName='pt-0'
      toggleSidebar={() => toggleSidebar(false, formik.dirty, '', isActiveElement)}
    >
      <Hotkeys keyName="ctrl+alt+s,ctrl+alt+c,enter,escape" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
      <Card className='munim-side-card-border'>
        <CardBody>
          <Row>
            <Col md='12' className='mb-1 position-relative'>
              {isActiveElement === 'product_type' ? <InputTextField
                label='Product Type'
                name='types'
                placeholder='Enter Product Type'
                value={formik.values.types}
                handleChange={formik.setFieldValue}
                handleBlur={formik.setFieldTouched}
                autoComplete='off'
              /> : <InputTextField
                label='Category Name'
                name='categories'
                placeholder='Enter Category Name'
                value={formik.values.categories}
                handleChange={formik.setFieldValue}
                handleBlur={formik.setFieldTouched}
                autoComplete='off'
              />}
            </Col>
            <Col md='12' className='mb-1 position-relative'>
              <Label className='form-label' for='Is Active'>
                <div className='d-flex justify-content-start munim-gap-6 munim-tooltip-flex'>
                  <span>Status</span>
                  <HelpTooltip id='is_active' label={`User can set ${isActiveElement === 'product_type' ? 'product type' : 'category'} status as Active / Inactive using this option. e.g. Suppose this option is marked as Inactive, it will not display.`} />
                </div>
              </Label>
              <RadioButton
                name='categories_status'
                value={formik.values.categories_status}
                handleChange={formik.setFieldValue}
                label1='Active'
                label2='Inactive'
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className='munim-sidebar-footer'>
        <div className='d-flex justify-content-between munim-save'>
          <CustomButton className='me-1' outline color='secondary' type='button' handleClick={() => toggleSidebar(false, formik.dirty, '', isActiveElement)} label='Cancel' tabIndex="-1" />
          <CustomButton className='me-1' color='primary' type='button' disabled={!formik.dirty} handleClick={formik.handleSubmit} nextFocusId={''} label='Save' loader={saveLoader} />
        </div>
      </div>

    </Sidebar>
  )
}

export default CategorySidebar
