/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import Sidebar from '@components/sidebar'
import { Row, Col, Label, CardBody } from 'reactstrap'
import Hotkeys from 'react-hot-keys'
import { useFormik } from 'formik'
import CustomButton from '../../../common_components/custom_field/CustomButton'
import CommonApiEndPoint from '../../../helper/commonApiEndPoint'
import { ApiCall, GetApiCall } from '../../../helper/axios'
import useNotify from '../../../custom_hooks/useNotify'
import { handlePageRefresh } from '../../../helper/commonFunction'
import { useSelector } from 'react-redux'
import FixSelect from '../../../common_components/search_select/FixSelect'
import * as Yup from 'yup'
import ValidationMessage from '../../../common_components/Validation'
import ChannelSelect from '../../../common_components/search_select/ChannelSelect'

const AddChannelSidebar = ({ open, toggleSidebar, addChannelData, addChannelId, channelFlag = false }) => {
    const notify = useNotify()
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const companyList = useSelector((state) => state.commonReducer.company_list)
    const [companyData, setCompanyData] = useState([])
    const [saveLoader, setSaveLoader] = useState(false)
    const [channelDataList, setChannelDataList] = useState([])
    const [channelList, setChannelList] = useState([])
    const [channelData, setChannelData] = useState([])
    const [isNextChannel, setIsNextChannel] = useState('1')
    const [channelType, setChannelType] = useState('')
    const [initialState] = useState({
        company_name: "",
        channel: addChannelId?.value,
        channel_product: ""
    })

    const formSchema = Yup.object().shape({
        company_name: Yup.string().trim()
            .when("channelFlag", {
                is: true,
                then: Yup.string()
                    .min(2, ValidationMessage.to_short)
                    .required(ValidationMessage.is_require)
            }),

        channel: Yup.string().trim()
            .min(2, ValidationMessage.to_short)
            .required(ValidationMessage.is_require),
        channel_product: Yup.string().trim()
            .min(2, ValidationMessage.to_short)
            .required(ValidationMessage.is_require)
    })
    const formik = useFormik({
        initialValues: initialState,
        validationSchema: formSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            handleSave(values)
        }
    })
    /**
     * IW0214
     * This function is call on save channel and product types data
     */
    const handleSave = async () => {
        setSaveLoader(true)
        const header = { 'access-token': localStorage.getItem('access_token') }
        const data = {
            map_items: [
                {
                    item_id: formik.values.channel_product,
                    variant_sku: addChannelData.sku
                }
            ]
        }
        const res = await ApiCall('POST', CommonApiEndPoint.map_channel_items, data, header)
        if (res.data.status === 'success') {
            notify(res.data.message, 'success')
            formik.handleReset()
            setSaveLoader(false)
            window.removeEventListener("beforeunload", handlePageRefresh)
            toggleSidebar(true, false, res.data.data)
        } else {
            formik.setSubmitting(false)
            formik.handleReset()
            notify(res.data.message, 'error')
            setSaveLoader(false)
            toggleSidebar(true, false, '')
        }
    }
    /**
     * IW0214
     * This function is call on short-cut key
     */
    const onKeyDown = (_, e) => {
        e.preventDefault()
        if ((e.altKey && e.ctrlKey && e.keyCode === 67) || e.key === 'Escape') {
            toggleSidebar(false, formik.dirty, '')
        }
    }
    /**
     * IW0214
     * This function is call on reload on data to open pop-up
     */
    useEffect(() => {
        if (formik.dirty) {
            window.addEventListener("beforeunload", handlePageRefresh)
        } else {
            window.removeEventListener("beforeunload", handlePageRefresh)
        }
    }, [formik.dirty])


    async function getchannelDataList(value) {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_connect_channel}?id=${value}&channel_type=0&per_page=50&limit=${0}&is_action=1`, header)
        if (res.data.status === 'success' && res.data.data.row_data.length > 0) {
            const channel_data = []
            res.data.data.row_data.map(item => {
                channel_data.push({
                    text: item.channel_name,
                    value: item.id,
                    channeltype: item.channel_type
                })
            })
            setChannelDataList(channel_data)
        } else if (res.data.statusCode === 404) {
            setChannelDataList([])
        }
    }

    const getChannelDataList = async (value) => {
        let company_data
        companyData.map((ele) => {
            if (ele.value === formik.values.company_name) {
                company_data = ele.id
            }
        })
        const header = {
            'access-token': localStorage.getItem('access_token')
        }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_channel_item_list}?id=${channelFlag ? selected_company_object.id : company_data}&channel_type=${value.channeltype}&per_page=25&limit=0&filter=&is_action=3`, header)
        if (res.data.status === 'success') {
            setChannelData(res.data.data.row_data)
            const mapped_channel_data = []
            res.data.data.row_data.map(item => {
                mapped_channel_data.push({
                    label: item.product_name,
                    value: item.id,
                    id: item.id,
                    customAbbreviation: { label: item.product_name }
                })
            })
            setChannelList(mapped_channel_data)
            setIsNextChannel(res.data.data.is_next)
        } else {
            setChannelList([])
        }
    }

    const handleChangeChannel = (value, option) => {
        const channel_data = [...channelData]
        if (option?.id) {
            channel_data.push(option)
            setChannelList([...channelList, { value: option?.id, label: option?.product_name, customAbbreviation: { label: option?.product_name } }])
            setChannelData(channel_data)
        }
        channel_data.find((ele) => {
            if (ele.id === value) {
                formik.setFieldValue('channel_product', value)
                return true
            }
        })
    }


    useEffect(() => {
        if (companyList?.length) {
            const company_data = []
            companyList.map(item => {
                company_data.push({
                    text: item.company_name,
                    value: item.comp_id,
                    id: item.id

                })
            })
            setCompanyData(company_data)
        }
    }, [companyList])

    useEffect(() => {
        if (formik.values.company_name) {
            const resultObject = companyList.find(ele => ele.comp_id === formik.values.company_name)
            getchannelDataList(resultObject.id)
        }
    }, [formik.values.company_name])


    useEffect(() => {
        if (selected_company_object.id && channelFlag) {
            getchannelDataList(selected_company_object.id)
        }
    }, [selected_company_object.id, channelFlag])


    useEffect(() => {
        if (formik.values.channel) {
            const resultObject = channelDataList.find(ele => ele.value === formik.values.channel)
            getChannelDataList(resultObject)
            setChannelType(resultObject?.channeltype)
        }
    }, [formik.values.channel])


    useEffect(() => {
        if (addChannelId?.value) {
            getChannelDataList(addChannelId)
            setChannelType(addChannelId?.channeltype)
        }
    }, [addChannelId?.values])


    return (
        <Sidebar
            size='half'
            open={open}
            title={addChannelData.product_name}
            wrapClassName='munim-sidebar'
            contentClassName='pt-0'
            toggleSidebar={() => toggleSidebar(false, formik.dirty, '')}
        >
            <Hotkeys keyName="ctrl+alt+s,ctrl+alt+c,enter,escape" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
            <CardBody className='p-0'>
                <Row>
                    {
                        !channelFlag && <Col md='12' className='mb-1 position-relative'>
                            <Label>Company Name</Label>
                            <FixSelect
                                placeholder={"Select company"}
                                id='company_name'
                                value={formik.values.company_name}
                                options={companyData}
                                handleChange={formik.setFieldValue}
                                handleBlur={formik.setFieldTouched}
                                errors={formik.errors.company_name}
                                touched={formik.touched.company_name}
                            />
                        </Col>
                    }
                    <Col md='12' className='mb-1 position-relative'>
                        <Label>Channel</Label>
                        <FixSelect
                            placeholder={"Select Channel Name"}
                            id='channel'
                            value={formik.values.channel}
                            options={channelDataList}
                            handleChange={formik.setFieldValue}
                            handleBlur={formik.setFieldTouched}
                            errors={formik.errors.channel}
                            touched={formik.touched.channel}
                        />
                    </Col>
                    <Col md='12' className='mb-1 position-relative'>
                        <Label>Channel Product</Label>
                        <ChannelSelect
                            placeholder="Select channel product"
                            name='channel_product'
                            apiPath={CommonApiEndPoint.get_channel_item_list}
                            dropdownValue={formik.values.channel_product}
                            dropdownList={channelList}
                            errors={formik.errors.channel_product}
                            touched={formik.touched.channel_product}
                            handleChangeValue={handleChangeChannel}
                            handleBlur={formik.setFieldTouched}
                            isNextData={isNextChannel}
                            setIsNextData={setIsNextChannel}
                            companyId={selected_company_object.id}
                            channelType={channelType}
                        />
                    </Col>
                </Row>
            </CardBody>
            <div className='munim-sidebar-footer'>
                <div className='d-flex justify-content-between munim-save'>
                    <CustomButton className='me-1' outline color='secondary' type='button' handleClick={() => toggleSidebar(false, formik.dirty, '')} label='Cancel' tabIndex="-1" />
                    <CustomButton className='me-1' disabled={!formik.dirty} color='primary' type='button' handleClick={formik.handleSubmit} nextFocusId={''} label='Save' loader={saveLoader} />
                </div>
            </div>
        </Sidebar>
    )
}

export default AddChannelSidebar
