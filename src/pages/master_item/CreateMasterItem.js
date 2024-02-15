/* eslint-disable no-use-before-define */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Accordion, AccordionBody, AccordionHeader, Button, Card, CardBody, Col, Input, Label, Row, Spinner, Tooltip } from 'reactstrap'
import CommonRouter from '../../helper/commonRoute'
import ModuleTitle from '../../common_components/ModuleTitle'
import { useHistory } from 'react-router-dom'
import InputTextField from '../../common_components/custom_field/InputTextField'
import InputTextAreaField from '../../common_components/custom_field/InputTextAreaField'
import CustomToggle from '../../common_components/custom_field/CustomToggle'
import { useFormik } from 'formik'
import * as yup from 'yup'
import ValidationMessage, { popUpMessage } from '../../common_components/Validation'
import HelpTooltip from '../../common_components/tooltip/HelpTooltip'
import RadioButton from '../../common_components/custom_field/RadioButton'
import OptionData from '../../common_components/OptionData'
import FixSelect from '../../common_components/search_select/FixSelect'
import { Plus, Trash2 } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { setShowHeaderAction } from '../../redux/headerActionSlice'
import { RouterPrompt } from '../../common_components/RouterPrompt'
import DiscardModal from '../../common_components/pop_up_modal/DiscardModal'
import Hotkeys from 'react-hot-keys'
import CustomButton from '../../common_components/custom_field/CustomButton'
import { getDetectOs, handlePageRefresh } from '../../helper/commonFunction'
import InputAmountField from '../../common_components/custom_field/InputAmountField'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { ApiCall, GetApiCall } from '../../helper/axios'
import useNotify from '../../custom_hooks/useNotify'
import CategorySidebar from './CategorySidebar'
import CategorySelect from '../../common_components/search_select/CategorySelect'
import DeleteModal from '../../common_components/pop_up_modal/DeleteModal'
import BasicAlert from '../../common_components/BasicAlert'
import { bucketPathUrl } from '../../helper/commonApi'
import InputNumberField from '../../common_components/custom_field/InputNumberField'

const CreateMasterItem = () => {
    const { gst_rate_options } = OptionData
    const regex = new RegExp(/^[A-Za-z0-9 ]+$/)
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const history = useHistory()
    const location_state = history.location.state
    const dispatch = useDispatch()
    const notify = useNotify()
    const detectOs = getDetectOs(navigator.platform)
    const [saveLoader, setSaveLoader] = useState(false)
    const [discardPopUpActive, setDiscardPopUpActive] = useState(false)
    const [itemImageToolTip, setItemImageToolTip] = useState(false)
    const [itemImageIndex, setItemImageIndex] = useState('')
    const [categoryList, setCategoryList] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const [categorySidebarOpen, setCategorySidebarOpen] = useState(false)
    const [isActiveElement, setIsActiveElement] = useState('')
    const [producTypeData, setProductTypeData] = useState([])
    const [producTypeList, setProductTypeList] = useState([])
    const [tagsList, setTagsList] = useState([])
    const [loader, setLoader] = useState(true)
    const [isFocusElementId, setIsFocusElementId] = useState('')
    const [optionNameList, setOptionNameList] = useState([])
    const [optionNameData, setOptionNameData] = useState([])
    const [deleteTitle, setDeleteTitle] = useState({ title: '', id: '' })
    const [deleteVariants, setDeleteVariants] = useState([])
    const [deletePopUpActive, setDeletePopUpActive] = useState(false)
    const [showAlertMessage, setShowAlertMessage] = useState(false)
    const [deleteImage, setDeleteImage] = useState({ img_name: '', img_value: '', img_id: '', img_class: '' })
    const [isDeleteImage, setIsDeleteImage] = useState(0)
    const [deleteVariantsId, setDeleteVariantsId] = useState([])
    const [editVariants, setEditVariants] = useState([])
    const [isNextCategories, setIsNextCategories] = useState('1')
    const [categoryFilterValue, setCategoryFilterValue] = useState('')
    const [isNextProductType, setIsNextProductType] = useState('1')
    const [productFilterValue, setProductFilterValue] = useState('')
    const [isNextOptionName, setIsNextOptionName] = useState('1')
    const [isNextTags, setIsNextTags] = useState('1')
    const [isTagsData, setIsTagsData] = useState(false)
    const [open, setOpen] = useState(0)
    const [skuElementErrors, setSkuElementErrors] = useState([])
    const [initialState, setInitialState] = useState({
        title: '',
        description: '',
        image: '',
        status: 1,
        gst_rate: '0',
        categories: '',
        product_type: '',
        is_having_variants: 0,
        add_more_value: '',
        hsn: '',
        option_name: [],
        option_value: [],
        tags: [],
        variants: [
            {
                variant_title: '',
                sales_price: '0.00',
                purchase_price: '0.00',
                lisiting_price: '0.00',
                mrp: '0.00',
                opening_stock: '0.00',
                sku: '',
                low_stock_warning: false,
                low_limit_unit: '',
                image: '',
                status: 1
            }
        ]
    })
   /**
    * IW0110
    * This function is check max length for amount value
    */
    const maxLengthValidation = (value) => {
        const filed_val = value?.toString()?.split('.')
        if (value && filed_val[0]?.length > 10) {
            return false
        }
        return true
    }
    const itemSchema = yup.object().shape({
        title: yup.string().trim()
            .required(ValidationMessage.is_require),
        variants: yup.array().of(
            yup.object().shape({
                sku: yup.string().trim()
                    .required(ValidationMessage.is_require),
                low_limit_unit: yup.number()
                    .when('low_stock_warning', {
                        is: true,
                        then: yup.number()
                            .moreThan(0, ValidationMessage.more_then_zero)
                            .required(ValidationMessage.is_require)
                            .test('len', ValidationMessage.max_amt_digit, (value) => maxLengthValidation(value))
                    }),
                purchase_price: yup.number()
                    .test('len', ValidationMessage.max_amt_digit, (value) => maxLengthValidation(value)),
                lisiting_price: yup.number()
                    .test('len', ValidationMessage.max_amt_digit, (value) => maxLengthValidation(value)),
                mrp: yup.number()
                    .test('len', ValidationMessage.max_amt_digit, (value) => maxLengthValidation(value)),
                sales_price: yup.number()
                    .test('len', ValidationMessage.max_amt_digit, (value) => maxLengthValidation(value)),
                opening_stock: yup.number()
                    .test('len', ValidationMessage.max_amt_digit, (value) => maxLengthValidation(value))
            })
        ),
        option_name: yup.array().of(
            yup.string()
                .required(ValidationMessage.is_require)
        ),
        option_value: yup.array().of(
            yup.array().of(
                yup.string()
                    .required(ValidationMessage.is_require)
            )
        ),
        hsn: yup.string().trim()
            .matches(regex, ValidationMessage.item_code_valid)
            .min(4, ValidationMessage.hsn_sac_min)
            .required(ValidationMessage.is_require)
    })
    const formik = useFormik({
        initialValues: initialState,
        enableReinitialize: true,
        validationSchema: itemSchema,
        validate: values => {
            const errors = {}
            if (values.is_having_variants) {
                const option_name = [...values.option_name]
                const alreadySeenName = {}
                const duplicate_name = []
                if (option_name?.length) {
                    option_name.forEach((str) => {
                        if (alreadySeenName[str]) {
                            duplicate_name.push(`You've already used this option name "${str}".`)
                        } else {
                            alreadySeenName[str] = true
                            duplicate_name.push(undefined)
                        }
                    })
                    if (duplicate_name.filter(ele => ele)?.length) errors.option_name = duplicate_name
                }

                const option_value = [...values.option_value]
                const duplicate_errors_value = []
                for (let index = 0; index < option_name.length; index++) {
                    const alreadySeenValue = {}
                    const duplicate_value = []
                    if (option_value[index]?.length) {
                        option_value[index].forEach((str) => {
                            if (alreadySeenValue[str]) {
                                duplicate_value.push(`You've already used this option value "${str}".`)
                            } else {
                                alreadySeenValue[str] = true
                                duplicate_value.push(undefined)
                            }
                        })
                        duplicate_errors_value.splice(index, 1, duplicate_value)
                    }
                }
                if (duplicate_errors_value.flat()?.filter(ele => ele)?.length) errors.option_value = duplicate_errors_value
            }
            // Here, show error when already available sku in master item 
            const sku_errors = [...skuElementErrors]
            const sku_err_element = []
            if (sku_errors.filter(ele => ele).length) {
                sku_errors.forEach(ele => {
                    if (ele) sku_err_element.push({ sku: ele })
                    else sku_err_element.push('')
                })
                errors.variants = sku_err_element
            }
            // Here, apply sku error validation when duplicate sku in variants
            const variant_values = [...values.variants]
            const sku_values = variant_values.map(ele => ele.sku)
            const duplicate_value = sku_values.filter((ele, idn, array) => array.indexOf(ele) !== idn)
            if (duplicate_value.filter(ele => ele).length) {
                const final_error = []
                sku_values.forEach(ele => {
                    if (ele && duplicate_value.includes(ele)) final_error.push({ sku: `You've already used this "${ele}" sku.` })
                    else final_error.push('')
                })
                if (sku_err_element.length) {
                    sku_err_element.forEach((ele, index) => {
                        if (ele) final_error.splice(index, 1, ele)
                    })
                }
                errors.variants = final_error
            }
            return errors
        },
        onSubmit: values => {
            handleSave(values)
        }
    })
    /**
    * IW0110
    * This function is create and update item data
    */
    const handleSave = async (values) => {
        if ((values.is_having_variants && values.option_name.length >= 1) || !values.is_having_variants) {
            setSaveLoader(true)
            const header = { 'access-token': localStorage.getItem('access_token') }
            let variants
            if (values.is_having_variants) {
                variants = values.variants?.map(ele => { return { ...ele, image: ele.image ? ele.image?.split('/images/items/')[1] : '', low_limit_unit: ele.low_stock_warning ? ele.low_limit_unit : '0.00', sku: ele.sku?.trim(), low_stock_warning: ele.low_stock_warning ? 1 : 0 } })
            } else {
                variants = [
                    {
                        variant_title: 'Default',
                        sales_price: values.variants[0].sales_price,
                        purchase_price: values.variants[0].purchase_price,
                        lisiting_price: values.variants[0].lisiting_price,
                        mrp: values.variants[0].mrp,
                        opening_stock: values.variants[0].opening_stock,
                        sku: values.variants[0].sku?.trim(),
                        low_stock_warning: values.variants[0].low_stock_warning ? 1 : 0,
                        low_limit_unit: values.variants[0].low_stock_warning ? values.variants[0].low_limit_unit : '0.00',
                        status: values.variants[0].status,
                        image: values.image ? values.image?.split('/images/items/')[1] : '',
                        id: values.variants[0].id
                    }
                ]
            }
            const variant_option = values.option_name?.reduce((result, value, index) => {
                if (value) {
                    if (values.option_value[index]?.filter(ele => ele)?.length) {
                        result[value] = values.option_value[index]
                    }
                }
                return result
            }, {})
            const data = {
                title: values.title,
                description: values.description,
                image: values.image ? values.image?.split('/images/items/')[1] : '',
                gst_rate: values.gst_rate,
                status: values.status ? 1 : 0,
                categories: values.categories,
                product_type: values.product_type,
                tags: values.tags?.map(ele => ele.label),
                hsn: values.hsn,
                variants,
                variant_option
            }
            if (location_state?.item_id) {
                // Here, add delete variant id when user delete variants name or value on edit mode
                const deleted_variant_value = formik.initialValues.variants?.filter(ele => !values.variants?.map(sub_ele => sub_ele.id).includes(ele.id))?.map(ele => ele.id)
                const deleted_variant_option = [...deleteVariantsId, ...deleted_variant_value]
                data.deleted_variant = [... new Set(deleted_variant_option)]
                data.id = location_state?.item_id
                const res = await ApiCall('PUT', CommonApiEndPoint.update_master_item, data, header)
                if (res.data.status === 'success') {
                    notify(res.data.message, 'success')
                    formik.handleReset()
                    setSaveLoader(false)
                    window.removeEventListener("beforeunload", handlePageRefresh)
                    history.push(CommonRouter.master_item)
                } else {
                    window.scrollTo(document.body.scrollHeight || document.documentElement.scrollHeight, 0)
                    setSaveLoader(false)
                    notify(res.data.message, 'error')
                }
            } else {
                const res = await ApiCall('POST', CommonApiEndPoint.create_master_item, data, header)
                if (res.data.status === 'success') {
                    notify(res.data.message, 'success')
                    formik.handleReset()
                    setSaveLoader(false)
                    window.removeEventListener("beforeunload", handlePageRefresh)
                    history.push(CommonRouter.master_item)
                } else {
                    window.scrollTo(document.body.scrollHeight || document.documentElement.scrollHeight, 0)
                    setSaveLoader(false)
                    notify(res.data.message, 'error')
                }
            }
        } else {
            setShowAlertMessage(true)
        }
    }
    /**
    * IW0110
    * This function is called when user insert or change feature image
    */
    const uploadImage = async (image = '', name = '', value = '', id = '') => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const data = {
            title: formik.values.title,
            image,
            is_action: 1
        }
        if (value) data.delete_image = value?.split('/images/items/')[1]
        if (history.location.pathname.includes('edit')) {
            if (id) data.is_action = 2
            if (name === 'image' && id) data.master_id = id
            else if (id) data.variant_id = id
        }
        const res = await ApiCall('POST', CommonApiEndPoint.image_upload, data, header)
        if (res.data.status === 'success') {
            let final_image
            if ((res.data.data).startsWith('http')) {
                final_image = res.data.data
            } else {
                final_image = `${bucketPathUrl}assets/images/items/${res.data.data}`
            }
            formik.setFieldValue(name, final_image)
        } else {
            formik.setFieldValue(name, '')
        }
    }
    /**
    * IW0110
    * This function is call on handle item image
    */
    const handleItemimage = (e, name, value, id, field_class) => {
        const reader = new FileReader(),
            files = e.target.files
        const fileTypes = ['png', 'jpeg', 'jpg']
        if (e.target.files[0]?.size <= 2097152 && fileTypes) {
            const extension = files[0].name.split('.').pop().toLowerCase(),
                isSuccess = fileTypes.indexOf(extension) > -1
            if (isSuccess) {
                reader.onload = function () {
                    uploadImage(reader.result, name, value, id)
                }
            }
            reader.readAsDataURL(files[0])
        } else {
            notify('Upload file size up to 2 MB', 'error')
            const item_image_attachment = document.querySelector(`.${field_class}`)
            item_image_attachment.value = ''
        }
    }
    /**
    * IW0110
    * This function is call on delete item or variant image
    */
    const handleDeleteImage = async (deleteObj) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const data = {
            delete_image: deleteObj.img_value?.split('/images/items/')[1],
            is_action: 0
        }
        if (deleteObj.img_id) {
            if (deleteObj.img_name === 'image') data.master_id = deleteObj.img_id
            else data.variant_id = deleteObj.img_id
        }
        const res = await ApiCall('POST', CommonApiEndPoint.image_upload, data, header)
        if (res.data.status === 'success') {
            formik.setFieldValue(deleteObj.img_name, '')
            const item_image_attachment = document.querySelector(`.${deleteObj.img_class}`)
            item_image_attachment.value = ''
        } else {
            formik.setFieldValue(deleteObj.img_name, deleteObj.img_value)
        }
        setDeletePopUpActive(!deletePopUpActive)
    }
    /**
    * IW0110
    * this function is call when user click on discard button in header
    */
    const handleDiscardPopUp = (flag = false) => {
        if (flag) {
            if (categorySidebarOpen) {
                if (!formik.dirty) window.removeEventListener("beforeunload", handlePageRefresh)
                if (categorySidebarOpen) {
                    if (isActiveElement === 'categories') {
                        document.getElementById('categories').focus()
                        setCategoryFilterValue('')
                    } else {
                        document.getElementById('product_type').focus()
                        setProductFilterValue('')
                    }
                    setCategorySidebarOpen(false)
                }
            } else {
                if (!formik.dirty) window.removeEventListener("beforeunload", handlePageRefresh)
                setInitialState({
                    ...initialState,
                    image: history.location.pathname.includes('edit') ? formik.values.image : '',
                    variants: formik.initialValues.variants?.map((ele, index) => { return { ...ele, image: history.location.pathname.includes('edit') ? formik.values.variants[index]?.image : '' } })
                })
                const item_image_attachment = document.querySelector('.item_image_attach')
                item_image_attachment.value = ''
                formik.handleReset()
                window.removeEventListener("beforeunload", handlePageRefresh)
                setIsFocusElementId('')
                setDeleteTitle({ title: '', id: '' })
                setDeleteVariants([])
                setShowAlertMessage(false)
                setIsDeleteImage(0)
                setDeleteImage({ img_name: '', img_value: '', img_id: '', img_class: '' })
                setDeleteVariantsId([])
                setSkuElementErrors([])
                const edit_variant = []
                const option_name = [...formik.initialValues.option_name]
                for (let index = 0; index < option_name.length; index++) {
                    edit_variant.push(true)
                }
                setEditVariants(edit_variant)
            }
            setDiscardPopUpActive(false)
        } else {
            setDiscardPopUpActive(false)
        }
    }
    const handleDiscard = () => {
        setDiscardPopUpActive(true)
    }
    /**
    * IW0110
    * This function is call on submit final data
    */
    const handleSubmit = () => {
        if ((formik.values.is_having_variants && formik.values.option_name.length >= 1) || !formik.values.is_having_variants) {
            if (Object.keys(formik?.errors).length) {
                if (formik.errors?.variants) {
                    let error_id = 'variants'
                    formik.errors?.variants.map((item, index) => {
                        if (item && !error_id.includes('.')) {
                            if (item?.sku !== '') {
                                error_id += `.${index}`
                                const item_key = Object.keys(item)
                                error_id += `.${item_key[0]}`
                                setOpen(index)
                            }
                        }
                    })
                    document.getElementById(error_id)?.focus()
                    const element = document.getElementById(error_id)
                    element?.scrollIntoView(false)
                } else if (formik.errors?.option_name) {
                    let error_id = 'option_name'
                    formik.errors?.option_name.map((item, index) => {
                        if (item && !error_id.includes('.')) {
                            error_id += `.${index}`
                        }
                    })
                    document.getElementById(error_id)?.focus()
                    const element = document.getElementById(error_id)
                    element?.scrollIntoView(false)
                } else if (formik.errors?.option_value) {
                    let error_id = 'option_value'
                    formik.errors?.option_value.map((item, index) => {
                        if (item && !error_id.includes('.')) {
                            error_id += `.${index}`
                            const item_key = Object.keys(item)
                            error_id += `.${item_key[0]}`
                        }
                    })
                    document.getElementById(error_id)?.focus()
                    const element = document.getElementById(error_id)
                    element?.scrollIntoView(false)
                } else {
                    const error_id = Object.keys(formik.errors)[0]
                    document.getElementById(error_id)?.focus()
                    const element = document.getElementById(error_id)
                    element?.scrollIntoView(false)
                }
                formik.handleSubmit()
            } else {
                formik.handleSubmit()
            }
        } else {
            setShowAlertMessage(true)
        }
    }
    useEffect(() => {
        if (formik.dirty) {
            dispatch(setShowHeaderAction({ display: true, title: 'Unsaved draft item.', mainAction: handleSubmit, secondaryAction: handleDiscard, loader: saveLoader }))
        } else {
            dispatch(setShowHeaderAction({ display: false, title: '', mainAction: handleSubmit, secondaryAction: handleDiscard, loader: saveLoader }))
            setSkuElementErrors([])
        }
    }, [formik.dirty, saveLoader, formik.errors])
    /**
    * IW0110
    * This function is call on shortcut keys
    */
    const onKeyDown = (keyName, e) => {
        if (document.activeElement.className.includes('allow-enter') && keyName === 'enter') {
        } else {
            e.preventDefault()
        }
        if (keyName === 'alt+s' && !history.location.pathname.includes('view') && formik.dirty) {
            handleSubmit()
        } else if (keyName === 'alt+d' && !history.location.pathname.includes('view') && formik.dirty) {
            handleDiscard()
        } else if (keyName === 'alt+c') {
            history.push(CommonRouter.master_item)
        }
    }
    /**
     * IW0110
     * This function is call on get categories list
     */
    const getCategoryData = async () => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_category}?is_action=1&per_page=25&limit=0&filter=`, header)
        setCategoryData(res.data.data.row_data)
        let category_list = []
        if (res.data.status === 'success' && res.data.statusCode === 200) {
            category_list = [
                {
                    value: '0',
                    label: '+ Create New Category',
                    type: 'button',
                    color: 'flat-success'
                }
            ]
            res.data.data.row_data?.map(item => {
                category_list.push({ value: item.id, label: item.categories, customAbbreviation: { label: item.categories } })
            })
            setCategoryList(category_list)
            setIsNextCategories(res.data.data.is_next)
        } else {
            setCategoryList([
                {
                    value: '0',
                    label: '+ Create New Category',
                    type: 'button',
                    color: 'flat-success'
                }
            ])
        }
    }
    /**
     * IW0110
     * This function is called when user change categories or product type
     */
    const handleChangeCategory = (value, option, is_active_element = '', label, index) => {
        setIsActiveElement(is_active_element)
        if (value === '0') {
            setCategorySidebarOpen(true)
        } else {
            if (is_active_element === 'product_type') {
                const product_data = [...producTypeData]
                if (option?.id) {
                    product_data.push(option)
                    setProductTypeList([...producTypeList, { value: option?.id, label: option?.types, customAbbreviation: { label: option?.types } }])
                    setProductTypeData(product_data)
                }
                product_data.find((ele) => {
                    if (ele.id === value) {
                        formik.setFieldValue(is_active_element, label)
                        return true
                    }
                })
            } else if (is_active_element === 'categories') {
                const category_data = [...categoryData]
                if (option?.id) {
                    category_data.push(option)
                    setCategoryList([...categoryList, { value: option?.id, label: option?.categories, customAbbreviation: { label: option?.categories } }])
                    setCategoryData(category_data)
                }
                category_data.find((ele) => {
                    if (ele.id === value) {
                        formik.setFieldValue(is_active_element, label)
                        return true
                    }
                })
            } else {
                const option_name_data = [...optionNameData]
                if (option?.id) {
                    option_name_data.push(option)
                    setOptionNameList([...optionNameList, { value: option?.id, label: option?.options, customAbbreviation: { label: option?.options } }])
                    setOptionNameData(option_name_data)
                }
                option_name_data.find((ele) => {
                    if (ele.id === value) {
                        formik.setFieldValue(is_active_element, label)
                        const add_option_value = [...formik.values.option_value]
                        add_option_value.splice(index, 1, [''])
                        formik.setFieldValue('option_value', add_option_value)
                        return true
                    }
                })
            }
        }
    }
    /**
     * IW0110
     * This function is handle categories and product type sidebar
     */
    const categorySidebar = (flag = false, isChange = false, data = [], is_active_element = '', is_next = '0') => {
        if (categorySidebar && (flag === true || !isChange)) {
            document.getElementById(is_active_element)?.focus()
        }
        if (flag) {
            setCategorySidebarOpen(!categorySidebarOpen)
            if (data.length) {
                if (is_active_element === 'product_type') {
                    setProductTypeData(data)
                    const product_list = [
                        {
                            value: '0',
                            label: '+ Create New Product Type',
                            type: 'button',
                            color: 'flat-success'
                        }
                    ]
                    data?.map(item => {
                        product_list.push({ value: item.id, label: item.types, customAbbreviation: { label: item.types } })
                    })
                    setProductTypeList(product_list)
                    formik.setFieldValue(is_active_element, product_list[1].label)
                    setProductFilterValue('')
                    setIsNextProductType(is_next)
                } else {
                    setCategoryData(data)
                    const category_list = [
                        {
                            value: '0',
                            label: '+ Create New Category',
                            type: 'button',
                            color: 'flat-success'
                        }
                    ]
                    data?.map(item => {
                        category_list.push({ value: item.id, label: item.categories, customAbbreviation: { label: item.categories } })
                    })
                    setCategoryList(category_list)
                    formik.setFieldValue(is_active_element, category_list[1].label)
                    setCategoryFilterValue('')
                    setIsNextCategories(is_next)
                }
            }
        } else if (isChange) {
            handleDiscard()
        } else {
            setCategorySidebarOpen(!categorySidebarOpen)
        }
    }
    /**
     * IW0110
     * This function is call on get product types list
     */
    const getProductType = async () => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_item_type}?is_action=1&per_page=25&limit=0&filter=`, header)
        setProductTypeData(res.data.data.row_data)
        let item_list = []
        if (res.data.status === 'success' && res.data.statusCode === 200) {
            item_list = [
                {
                    value: '0',
                    label: '+ Create New Product Type',
                    type: 'button',
                    color: 'flat-success'
                }
            ]
            res.data.data.row_data?.map(item => {
                item_list.push({ value: item.id, label: item.types, customAbbreviation: { label: item.types } })
            })
            setProductTypeList(item_list)
            setIsNextProductType(res.data.data.is_next)
        } else {
            setProductTypeList([
                {
                    value: '0',
                    label: '+ Create New Product Type',
                    type: 'button',
                    color: 'flat-success'
                }
            ])
        }
    }
    /**
     * IW0110
     * This function is call on get tags list
     */
    const getTagsData = async (item_id) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_tag}?is_action=1&limit=0&per_page=25&filter=`, header)
        const tag_list = []
        if (res.data.status === 'success' && res.data.statusCode === 200) {
            res.data.data.row_data?.map(item => {
                tag_list.push({ value: item.id, label: item.tags })
            })
            setTagsList(tag_list)
            setIsNextTags(res.data.data.is_next)
        } else {
            setTagsList([])
        }
        if (item_id) getItemDetails(item_id, tag_list)
    }
    /**
     * IW0110
     * This function is called when user create new tags
     */
    const createTags = async (flag, name, value) => {
        if (flag) {
            const tag_list_value = [...formik.values.tags]
            const option_tag_list = [...tagsList]
            if (value?.value) {
                option_tag_list.push(value)
                setTagsList([...tagsList, value])
                formik.setFieldValue(name, [...tag_list_value, value])
            }
        } else {
            const header = { 'access-token': localStorage.getItem('access_token') }
            const data = {
                tags: value,
                status: 1
            }
            const res = await ApiCall('POST', CommonApiEndPoint.create_tag, data, header)
            if (res.data.status === 'success') {
                notify(res.data.message, 'success')
                const tag_list = []
                res.data.data.row_data?.map(item => {
                    tag_list.push({ value: item.id, label: item.tags })
                })
                setTagsList(tag_list)
                setIsNextTags(res.data.data.is_next)
                formik.setFieldValue('tags', [...formik.values.tags, tag_list[0]])
            } else {
                notify(res.data.message, 'error')
            }
        }
        setTimeout(() => { setIsTagsData(true) }, 600)
    }
    /**
    * IW0110
    * This function is call on get item details
    */
    const getItemDetails = async (id, tag_list) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_master_item_details}?id=${id}`, header)
        if (res.data.status === 'success') {
            let tags = []
            res.data.data.is_having_variants = res.data.data.is_default ? 0 : 1
            res.data.data.status = res.data.data.status === '1' ? 1 : 0
            res.data.data.image = res.data.data.image && `${bucketPathUrl}assets/images/items/${res.data.data.image}`
            if (res.data.data.is_having_variants) {
                res.data.data.option_name = Object.keys(res.data.data.variant_option)
                res.data.data.option_value = Object.values(res.data.data.variant_option)
                const edit_variant = []
                const option_name = [...res.data.data.option_name]
                for (let index = 0; index < option_name.length; index++) {
                    edit_variant.push(true)
                }
                setEditVariants(edit_variant)
                let variant_data
                if (res.data.data.option_value?.length < 1) variant_data = getVariantElement(res.data.data.option_value[0])
                else if (res.data.data.option_value?.length < 2) variant_data = getVariantElement(res.data.data.option_value[0], res.data.data.option_value[1])
                else variant_data = getVariantElement(res.data.data.option_value[0], res.data.data.option_value[1], res.data.data.option_value[2])
                const variant_title = []
                variant_data.map(ele => {
                    // This method determines whether the passed value is an array.
                    if (Array.isArray(ele)) {
                        if (!(ele?.filter(x => x === ''))?.length) variant_title.push(ele?.join(' / '))
                    } else if (ele) {
                        variant_title.push(ele)
                    }
                })
                const final_variant_option = []
                variant_title.forEach((ele) => {
                    const new_obj = res.data.data.variants?.find(sub => sub.variant_title === ele)
                    if (new_obj?.id) {
                        new_obj.image = new_obj?.image && `${bucketPathUrl}assets/images/items/${new_obj?.image}`
                        if (new_obj.low_stock_warning === '1') new_obj.low_stock_warning = true
                        else new_obj.low_stock_warning = false
                        final_variant_option.push(new_obj)
                    }
                })
                res.data.data.variants = final_variant_option
            } else {
                res.data.data.variants[0].low_stock_warning = res.data.data.variants[0].low_stock_warning === '1'
                res.data.data.option_name = []
                res.data.data.option_value = []
            }
            if (tag_list?.length) {
                tags = tag_list?.filter(ele => res.data.data?.tags?.includes(ele.label))
            } else if (history.location.pathname.includes('view')) {
                setCategoryList([{ value: 1, label: res.data.data.categories }])
                setProductTypeList([{ value: 1, label: res.data.data.product_type }])
                tags = res.data.data.tags?.map((ele, i) => ({ value: i, label: ele }))
                const variant_name = res.data.data?.option_name?.map((ele, i) => ({ value: i, label: ele }))
                setOptionNameList(variant_name)
            }
            setInitialState({ ...res.data.data, tags })
            setLoader(false)
        }
    }
    /**
     * IW0110
     * This effect is called when first time reload the component
     */
    useEffect(() => {
        if (selected_company_object.id) {
            if (!history.location.pathname.includes('view')) {
                getCategoryData()
                getProductType()
                getTagsData(location_state?.item_id)
                if (!location_state?.item_id) setLoader(false)
            } else if (location_state?.item_id) {
                getItemDetails(location_state?.item_id)
            }
        }
    }, [selected_company_object.id, location_state])
    /**
     * IW0110
     * This function is add new option name 
     */
    const handleAddOptionName = () => {
        const add_option_name = [...formik.values.option_name, '']
        formik.setFieldValue('option_name', add_option_name)
        const add_option_value = [...formik.values.option_value, []]
        formik.setFieldValue('option_value', add_option_value)
        setShowAlertMessage(false)
        setEditVariants([...editVariants, false])
    }
    /**
    * IW0110
    * This function is add new option value 
    */
    const handleAddOptionValue = (index, name, value = '') => {
        const add_option_value = [...formik.values.option_value[index], value]
        const final_option_value = [...formik.values.option_value]
        final_option_value.splice(index, 1, add_option_value)
        formik.setFieldValue('option_value', final_option_value)
        formik.setFieldValue('add_more_value', '')
        setIsFocusElementId(name)
    }
    useEffect(() => {
        if (isFocusElementId) {
            document.getElementById(isFocusElementId)?.focus()
        }
    }, [isFocusElementId])
    /**
    * IW0110
    * This function is get options variant values
    */
    const getVariantElement = (item1, item2, item3) => {
        const variant_data = []
        // Here, calls a function for each element in an array.
        if (item1?.length && item2?.length && item3?.length) {
            item1.forEach(ele1 => {
                item2.forEach(ele2 => {
                    item3.forEach(ele3 => {
                        variant_data.push([ele1, ele2, ele3])
                    })
                })
            })
        } else if ((item1?.length && item2?.length) || (item1?.length && item3?.length) || (item2?.length && item3?.length)) {
            item1.forEach(ele1 => {
                item2.forEach(ele2 => {
                    variant_data.push([ele1, ele2])
                })
            })
        } else if (item1?.length) {
            item1.forEach(ele => {
                variant_data.push(ele)
            })
        }
        return variant_data
    }
    /**
     * IW0110
     * This function is get variant title
     */
    const getVariantTitle = (final_variant) => {
        const variant_values = [...formik.values.variants]
        const variant_title = []
        final_variant.map(ele => {
            // This method determines whether the passed value is an array.
            if (Array.isArray(ele)) {
                if (!(ele?.filter(x => x === ''))?.length) variant_title.push(ele?.join(' / '))
            } else if (ele) {
                variant_title.push(ele)
            }
        })
        const variants_option_values = []
        let is_active_variant = true
        // Here, calls a function for each element in an array.
        variant_title.forEach(title => {
            let new_obj
            is_active_variant = true
            if (variant_values.length) {
                // Here, check variant title for latest updated values
                variant_values.map(ele => {
                    if (title?.includes(ele.variant_title) || ele.variant_title?.includes(title)) {
                        // Here, If the value is changed, simply change the title
                        is_active_variant = false
                        new_obj = { ...ele, variant_title: title }
                    } else if (is_active_variant) {
                        // Otherwise change all the values
                        new_obj = {
                            variant_title: title,
                            sales_price: '0.00',
                            purchase_price: '0.00',
                            lisiting_price: '0.00',
                            mrp: '0.00',
                            opening_stock: '0.00',
                            sku: '',
                            low_stock_warning: false,
                            low_limit_unit: '',
                            status: 1,
                            image: ''
                        }
                    }
                })
            } else {
                // Add a new variant object when there is no variant
                new_obj = {
                    variant_title: title,
                    sales_price: '0.00',
                    purchase_price: '0.00',
                    lisiting_price: '0.00',
                    mrp: '0.00',
                    opening_stock: '0.00',
                    sku: '',
                    low_stock_warning: false,
                    low_limit_unit: '',
                    status: 1,
                    image: ''
                }
            }
            variants_option_values.push(new_obj)
        })
        const final_variant_option = variants_option_values.filter(ele => !deleteVariants.includes(ele.variant_title))
        formik.setFieldValue('variants', final_variant_option)
    }
    /**
     * IW0110
     * This function is handle show variants
     */
    const handleShowVariants = (name, field_index, value = '') => {
        formik.setFieldTouched(name)
        const option_value = [...formik.values.option_value]
        const option_one_value = option_value[0]?.filter(ele => ele)
        const option_two_value = option_value[1]?.filter(ele => ele)
        const option_three_value = option_value[2]?.filter(ele => ele)
        let final_variant
        // Here, get variant option values on field index
        if (field_index === 0) {
            if (option_three_value?.length) {
                if (option_two_value?.length) {
                    final_variant = getVariantElement(option_one_value, option_two_value, option_three_value)
                } else {
                    if (option_one_value?.length) {
                        final_variant = getVariantElement(option_one_value, option_three_value)
                    } else {
                        final_variant = getVariantElement([value], option_three_value)
                    }
                }
            } else if (option_two_value?.length) {
                final_variant = getVariantElement(option_one_value, option_two_value)
            } else {
                final_variant = getVariantElement(option_one_value)
            }
        } else if (field_index === 1) {
            if (option_three_value?.length) {
                if (option_one_value?.length) {
                    final_variant = getVariantElement(option_one_value, option_two_value, option_three_value)
                } else {
                    if (option_three_value?.length && option_one_value?.length) {
                        final_variant = getVariantElement(option_one_value, option_three_value)
                    } else {
                        if (option_two_value?.length) {
                            final_variant = getVariantElement(option_two_value, option_three_value)
                        } else {
                            final_variant = getVariantElement([value], option_three_value)
                        }
                    }
                }
            } else if (option_one_value?.length) {
                final_variant = getVariantElement(option_one_value, option_two_value)
            } else {
                final_variant = getVariantElement(option_two_value)
            }
        } else if (field_index === 2) {
            if (option_one_value?.length) {
                if (option_two_value?.length) {
                    final_variant = getVariantElement(option_one_value, option_two_value, option_three_value)
                } else {
                    if (option_one_value?.length) {
                        final_variant = getVariantElement(option_one_value, option_three_value)
                    } else {
                        final_variant = getVariantElement(option_one_value, [value])
                    }
                }
            } else if (option_two_value?.length) {
                final_variant = getVariantElement(option_two_value, option_three_value)
            } else {
                final_variant = getVariantElement(option_three_value)
            }
        }
        if (final_variant?.length) {
            getVariantTitle(final_variant)
        } else {
            formik.setFieldValue('variants', [])
        }
    }
    /**
     * IW0110
     * This function is handle delete variants name and value
     */
    const handleDeleteVariants = (name_index, value_index) => {
        const index_with_value = (name_index === 0 || name_index) && (value_index === 0 || value_index)
        const option_name = [...formik.values.option_name]
        const option_value = [...formik.values.option_value]
        const remove_option_value = [...formik.values.option_value[name_index]]
        const edit_variant = [...editVariants]
        // Here, instance change the contents of an array by removing or replacing existing elements, adding new elements
        if (index_with_value) {
            remove_option_value.splice(value_index, 1)
            option_value.splice(name_index, 1, remove_option_value)
        } else {
            option_name.splice(name_index, 1)
            option_value.splice(name_index, 1)
            edit_variant.splice(name_index, 1)
        }
        formik.setFieldValue('option_name', option_name)
        formik.setFieldValue('option_value', option_value)
        setEditVariants(edit_variant)
        let final_variant
        // Here, get variant option values on name index
        if (index_with_value) {
            if (option_value[0]?.length && option_value[1]?.length && option_value[2]?.length) {
                final_variant = getVariantElement(option_value[0], option_value[1], option_value[2])
            } else if ((option_value[0]?.length && option_value[1]?.length) || (option_value[0]?.length && option_value[2]?.length) || (option_value[1]?.length && option_value[2]?.length)) {
                if (option_value[0]?.length && option_value[1]?.length) {
                    final_variant = getVariantElement(option_value[0], option_value[1])
                } else if (option_value[0]?.length && option_value[2]?.length) {
                    final_variant = getVariantElement(option_value[0], option_value[2])
                } else if (option_value[1]?.length && option_value[2]?.length) {
                    final_variant = getVariantElement(option_value[1], option_value[2])
                }
            } else {
                if (option_value[0]?.length) {
                    final_variant = getVariantElement(option_value[0])
                } else if (option_value[1]?.length) {
                    final_variant = getVariantElement(option_value[1])
                } else if (option_value[2]?.length) {
                    final_variant = getVariantElement(option_value[2])
                }
            }
        } else {
            if (option_value[0]?.length && option_value[1]?.length) {
                final_variant = getVariantElement(option_value[0], option_value[1])
            } else if (option_value[0]?.length) {
                final_variant = getVariantElement(option_value[0])
            } else if (option_value[1]?.length) {
                final_variant = getVariantElement(option_value[1])
            }
        }
        if (final_variant?.length) {
            getVariantTitle(final_variant)
        } else {
            formik.setFieldValue('variants', [])
        }
    }
    /**
    * IW0110
    * This function is call on get variant option name list
    */
    const getVariantOptionName = async () => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_variant_options}?is_action=1&per_page=25&limit=0&filter=`, header)
        setOptionNameData(res.data.data.row_data)
        const item_list = []
        if (res.data.status === 'success' && res.data.statusCode === 200) {
            res.data.data.row_data?.map(item => {
                item_list.push({ value: item.id, label: item.options, customAbbreviation: { label: item.options } })
            })
            setOptionNameList(item_list)
            setIsNextOptionName(res.data.data.is_next)
        } else {
            setOptionNameList([])
        }
    }
    useEffect(() => {
        if (formik.values.is_having_variants && !history.location.pathname.includes('view')) {
            getVariantOptionName()
        }
    }, [formik.values.is_having_variants])
    /**
     * IW0110
     * This function is called when user create new variant name
     */
    const createVariantOptionName = async (value = '', index) => {
        const header = { 'access-token': localStorage.getItem('access_token'), id: selected_company_object.id }
        const data = {
            options: value,
            status: 1
        }
        const res = await ApiCall('POST', CommonApiEndPoint.create_variant_options, data, header)
        if (res.data.status === 'success') {
            notify(res.data.message, 'success')
            const option_list = []
            res.data.data.row_data?.map(item => {
                option_list.push({ value: item.id, label: item.options, customAbbreviation: { label: item.options } })
            })
            setOptionNameList(option_list)
            setIsNextOptionName(res.data.data.is_next)
            formik.setFieldValue(`option_name.${index}`, option_list[0]?.label)
            formik.setFieldValue(`option_value.${index}`, [''])
        } else {
            notify(res.data.message, 'error')
        }
    }
    /**
     * IW0110
     * This function is called when user active/inactive having variant option
     */
    const handleHavingVariant = () => {
        formik.setFieldValue('is_having_variants', !formik.values.is_having_variants ? 1 : 0)
        setSkuElementErrors([])
        setEditVariants([])
        setShowAlertMessage(false)
        if (!formik.values.is_having_variants) {
            formik.setFieldValue('option_name', [])
            formik.setFieldValue('option_value', [])
            formik.setFieldValue('variants', [])
        } else {
            formik.setFieldValue('variants', [
                {
                    variant_title: '',
                    sales_price: '0.00',
                    purchase_price: '0.00',
                    lisiting_price: '0.00',
                    mrp: '0.00',
                    opening_stock: '0.00',
                    sku: '',
                    low_stock_warning: false,
                    low_limit_unit: '',
                    status: 1,
                    image: ''
                }
            ])
        }
        if (history.location.pathname.includes('edit')) {
            const remove_variant = []
            formik.values.variants?.map(ele => {
                if (ele.id) remove_variant.push(ele.id)
            })
            setDeleteVariantsId(remove_variant)
            formik.setFieldValue('option_name', [])
            formik.setFieldValue('option_value', [])
        }
    }
    /**
     * IW0110
     * This function is handle delete variants
     */
    const handleDeleteVariantsOptions = ({ title, id }) => {
        const option_name = [...formik.values.option_name]
        const option_value = [...formik.values.option_value]
        const variants = [...formik.values.variants]
        const remove_name_index = []
        let is_single_value = true
        for (let index = 0; index < option_name.length; index++) {
            // Here, Check the option name and value if only one is available
            if (option_value[index]?.filter(ele => ele)?.length <= 1) {
                if (option_value[index]?.filter(ele => ele)?.length === 1) remove_name_index.push(index)
            } else if (option_value[index]?.filter(ele => ele)?.length > 1) {
                is_single_value = false
                remove_name_index.push(index)
            }
        }
        if (remove_name_index.length <= 1) {
            if (option_value[remove_name_index[0]]?.length <= 1) {
                // Here, delete variant when only one name and value available
                handleDeleteVariants(remove_name_index[0])
            } else {
                // Here, delete variant when only one name and multiple value available
                const remove_value_index = (option_value[remove_name_index[0]])?.indexOf(title)
                handleDeleteVariants(remove_name_index[0], remove_value_index)
            }
        } else if (remove_name_index.length && is_single_value) {
            // Here, delete variant when only one value available on multiple name
            for (let index = remove_name_index.length - 1; index >= 0; index--) {
                option_name.splice(remove_name_index[index], 1)
                option_value.splice(remove_name_index[index], 1)
            }
            formik.setFieldValue('option_name', option_name)
            formik.setFieldValue('option_value', option_value)
            formik.setFieldValue('variants', [])
        } else {
            const final_variant = variants.filter(ele => ele.variant_title !== title)
            formik.setFieldValue('variants', final_variant)
        }
        setDeleteVariants([...deleteVariants, title])
        if (id) setDeleteVariantsId([...deleteVariantsId, id])
        setDeletePopUpActive(!deletePopUpActive)
    }
    /**
     * IW0110
     * This function is call on open delete pop-up for variants
     */
    const handleDeletePopUp = (flag = false) => {
        setIsDeleteImage(0)
        if (flag) {
            handleDeleteVariantsOptions(deleteTitle)
        } else {
            setDeletePopUpActive(!deletePopUpActive)
        }
    }
    /**
     * IW0110
     * This function is call on open delete pop-up for image
     */
    const handleDeleteImagePopUp = (flag = false) => {
        setIsDeleteImage(1)
        setItemImageToolTip(false)
        if (flag) {
            handleDeleteImage(deleteImage)
        } else {
            setDeletePopUpActive(!deletePopUpActive)
        }
    }
    /**
     * IW0110
     * This function is handle edit variant option
     */
    const handleEditVariant = (flag, index) => {
        const edit_variant = [...editVariants]
        if (flag) {
            edit_variant.splice(index, 1, true)
        } else {
            edit_variant.splice(index, 1, false)
        }
        setEditVariants(edit_variant)
    }
    const toggle = id => { open === id ? setOpen() : setOpen(id) }
    /**
     * IW0110
     * This function is show error message when already available sku in master item
     */
    const checkExistsMasterSku = async (index, value, initial_value) => {
        const sku_errors = [...skuElementErrors]
        const error_msg = `You've already used this "${value}" sku.`
        const exists_value = sku_errors[index]?.match(/(?<=")\w+(?=")/g) || []
        if (value && value !== exists_value[0] && value !== initial_value) {
            const header = { 'access-token': localStorage.getItem('access_token') }
            const res = await GetApiCall('GET', `${CommonApiEndPoint.exists_master_sku}?sku=${value}`, header)
            if (res.data.status === 'success') {
                if (res.data.data) {
                    formik.setFieldError(`variants.${index}.sku`, error_msg)
                    sku_errors.splice(index, 1, error_msg)
                    setSkuElementErrors(sku_errors)
                } else {
                    formik.setFieldError(`variants.${index}.sku`, '')
                    sku_errors.splice(index, 1, '')
                    setSkuElementErrors(sku_errors)
                }
            }
        } else if (value !== exists_value[0]) {
            if (value) formik.setFieldError(`variants.${index}.sku`, '')
            else formik.setFieldError(`variants.${index}.sku`, ValidationMessage.is_require)
            sku_errors.splice(index, 1, '')
            setSkuElementErrors(sku_errors)
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

    return (
        <>
            <Row>
                <Hotkeys keyName="enter,alt+s,alt+d,alt+c" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
                <Col lg='9' sm='12'>
                    <div className='d-flex justify-content-between'>
                        <div className="munim-list-company">
                            <ModuleTitle breadCrumbTitle={history.location.pathname.includes('view') ? 'View Item' : history.location.pathname.includes('edit') ? 'Edit Item' : 'New Item'} links={[CommonRouter.master_item]} />
                        </div>
                    </div>
                    {showAlertMessage ? <BasicAlert type='warning' message='Please add least one variant.' /> : null}
                    <Card className={`mt-1 mb-0 munim-card-border ${history.location.pathname.includes('view') ? 'munim-filed-disabled' : ''}`}>
                        {loader ? <div className='m-auto p-1'><Spinner size='lg' /></div> :
                            <CardBody>
                                <Row>
                                    <Col md='8'>
                                        <div className='mb-1 position-relative'>
                                            <InputTextField
                                                isRequired={true}
                                                label='Product Title'
                                                name='title'
                                                placeholder='Enter Product Title'
                                                value={formik.values.title}
                                                handleChange={formik.setFieldValue}
                                                handleBlur={formik.setFieldTouched}
                                                autoComplete='off'
                                                errors={formik.errors.title}
                                                touched={formik.touched.title}
                                                disabled={history.location.pathname.includes('view')}
                                            />
                                        </div>
                                        <div className='mb-1 position-relative'>
                                            <InputTextAreaField
                                                label='Product Description'
                                                name='description'
                                                placeholder='Enter Product Description'
                                                rows='3'
                                                value={formik.values.description}
                                                handleChange={formik.setFieldValue}
                                                handleBlur={formik.setFieldTouched}
                                                autoComplete='off'
                                                disabled={history.location.pathname.includes('view')}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='4' className='mb-1 position-relative'>
                                        <Label className='form-label' for='Feature Image'>
                                            Feature Image
                                        </Label>
                                        <Card className={`mb-0 munim-card-border ${formik.values.image ? 'master-new-item-img' : ''}`}>
                                            <CardBody>
                                                {formik.values.image && !history.location.pathname.includes('view') ? <div className='feature-img-btn'>
                                                    <Trash2 size={20}
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            setDeleteImage({
                                                                img_name: 'image',
                                                                img_value: formik.values.image,
                                                                img_id: location_state?.item_id,
                                                                img_class: 'item_image_attach'
                                                            })
                                                            handleDeleteImagePopUp()
                                                        }}
                                                    />
                                                </div> : null}
                                                <div className='munim-item-img'>
                                                    <label id='item_img' className='cursor-pointer'>
                                                        {!formik.values.image ? <Plus size={20} /> : <img src={formik.values.image} width="300" height="100" />}
                                                        <Tooltip
                                                            placement='top'
                                                            isOpen={itemImageToolTip && itemImageIndex === 'item_img' && !history.location.pathname.includes('view')}
                                                            target='item_img'
                                                            toggle={() => { setItemImageToolTip(!itemImageToolTip); setItemImageIndex('item_img') }}
                                                        >
                                                            Click here to upload feature image.
                                                        </Tooltip>
                                                        <Input
                                                            type="file"
                                                            onChange={(e) => handleItemimage(e, 'image', formik.values.image, location_state?.item_id, 'item_image_attach')}
                                                            onClick={() => { setItemImageToolTip(!itemImageToolTip); setItemImageIndex('') }}
                                                            hidden
                                                            id="image_attach"
                                                            className='item_image_attach'
                                                            accept="image/png, image/jpeg, image/jpg"
                                                            disabled={history.location.pathname.includes('view')}
                                                        />
                                                    </label>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md='7' className='position-relative'>
                                        <Row>
                                            <Col md='4' className='mb-1 position-relative'>
                                                <InputNumberField
                                                    isRequired={true}
                                                    label='HSN/SAC Code'
                                                    value={formik.values.hsn}
                                                    placeholder='4 to 8 Digit Code'
                                                    name='hsn'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    maxLength={8}
                                                    disabled={history.location.pathname.includes('view')}
                                                    errors={formik.errors.hsn}
                                                    touched={formik.touched.hsn}
                                                />
                                            </Col>
                                            <Col md='4' className='mb-1 position-relative'>
                                                <Label className='form-label' for='GST rate(%)'>
                                                    GST Rate(%)
                                                </Label>
                                                <FixSelect
                                                    id='gst_rate'
                                                    value={formik.values.gst_rate}
                                                    options={gst_rate_options.slice(0, -2)}
                                                    handleChange={formik.setFieldValue}
                                                    disabled={history.location.pathname.includes('view')}
                                                />
                                            </Col>
                                            <Col md='4' className='position-relative d-flex gap-1 align-items-center'>
                                                <div className='munim-custom-field-toggle'>
                                                    <CustomToggle
                                                        name='is_having_variants'
                                                        label='Having Variants'
                                                        value={formik.values.is_having_variants}
                                                        handleChange={handleHavingVariant}
                                                        disabled={history.location.pathname.includes('view')}
                                                        custom_field={true}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>}
                    </Card>
                    {loader ? null : !formik.values.is_having_variants ? <Card className={`mt-1 mb-0 munim-card-border ${history.location.pathname.includes('view') ? 'munim-filed-disabled' : ''}`}>
                        <CardBody>
                            <h5>Pricing</h5>
                            <Row className='munim-variation-grid'>
                                <Col className='mb-1 position-relative'>
                                    <InputTextField
                                        isRequired={true}
                                        label='SKU'
                                        name={`variants.${0}.sku`}
                                        placeholder='SKU'
                                        value={formik.values.variants[0].sku}
                                        handleChange={formik.setFieldValue}
                                        handleBlur={() => { formik.setFieldTouched(`variants.${0}.sku`); checkExistsMasterSku(0, formik.values.variants[0].sku?.trim(), formik.initialValues.variants[0]?.sku) }}
                                        autoComplete='off'
                                        errors={formik.errors.variants && formik.errors?.variants[0]?.sku}
                                        touched={formik.touched.variants && formik.touched?.variants[0]?.sku}
                                        disabled={history.location.pathname.includes('view')}
                                    />
                                </Col>
                                <Col className='mb-1 position-relative'>
                                    <InputAmountField
                                        value={formik.values.variants[0].purchase_price}
                                        placeholder='Purchase Price'
                                        label='Purchase Price'
                                        name={`variants.${0}.purchase_price`}
                                        handleChange={formik.setFieldValue}
                                        handleBlur={formik.setFieldTouched}
                                        autoComplete='off'
                                        disabled={history.location.pathname.includes('view')}
                                        errors={formik.errors.variants && formik.errors?.variants[0]?.purchase_price}
                                        touched={formik.touched.variants && formik.touched?.variants[0]?.purchase_price}
                                    />
                                </Col>
                                <Col className='mb-1 position-relative'>
                                    <InputAmountField
                                        value={formik.values.variants[0].lisiting_price}
                                        placeholder='Listing Price'
                                        label='Listing Price'
                                        name={`variants.${0}.lisiting_price`}
                                        handleChange={formik.setFieldValue}
                                        handleBlur={formik.setFieldTouched}
                                        autoComplete='off'
                                        disabled={history.location.pathname.includes('view')}
                                        errors={formik.errors.variants && formik.errors?.variants[0]?.lisiting_price}
                                        touched={formik.touched.variants && formik.touched?.variants[0]?.lisiting_price}
                                    />
                                </Col>
                                <Col className='mb-1 position-relative'>
                                    <InputAmountField
                                        value={formik.values.variants[0].mrp}
                                        placeholder='MRP'
                                        label='MRP'
                                        name={`variants.${0}.mrp`}
                                        handleChange={formik.setFieldValue}
                                        handleBlur={formik.setFieldTouched}
                                        autoComplete='off'
                                        disabled={history.location.pathname.includes('view')}
                                        errors={formik.errors.variants && formik.errors?.variants[0]?.mrp}
                                        touched={formik.touched.variants && formik.touched?.variants[0]?.mrp}
                                    />
                                </Col>
                                <Col className='mb-1 position-relative'>
                                    <InputAmountField
                                        value={formik.values.variants[0].sales_price}
                                        placeholder='Sales Price'
                                        label='Sales Price'
                                        name={`variants.${0}.sales_price`}
                                        handleChange={formik.setFieldValue}
                                        handleBlur={formik.setFieldTouched}
                                        autoComplete='off'
                                        disabled={history.location.pathname.includes('view')}
                                        errors={formik.errors.variants && formik.errors?.variants[0]?.sales_price}
                                        touched={formik.touched.variants && formik.touched?.variants[0]?.sales_price}
                                    />
                                </Col>
                                <Col className='mb-1 position-relative'>
                                    <Label className='form-label' for='Low Stock Warning'>
                                        Low Stock Warning
                                    </Label>
                                    <RadioButton
                                        name={`variants.${0}.low_stock_warning`}
                                        value={formik.values.variants[0].low_stock_warning}
                                        handleChange={formik.setFieldValue}
                                        label1='Yes'
                                        label2='No'
                                        disabled={history.location.pathname.includes('view')}
                                    />
                                </Col>
                                {formik.values.variants[0].low_stock_warning ? <Col className='mb-1 position-relative'>
                                    <InputAmountField
                                        value={formik.values.variants[0].low_limit_unit}
                                        placeholder='Low Limit'
                                        label='Low Limit'
                                        name={`variants.${0}.low_limit_unit`}
                                        handleChange={formik.setFieldValue}
                                        handleBlur={formik.setFieldTouched}
                                        autoComplete='off'
                                        disabled={history.location.pathname.includes('view')}
                                        errors={formik.errors.variants && formik.errors?.variants[0]?.low_limit_unit}
                                        touched={formik.touched.variants && formik.touched?.variants[0]?.low_limit_unit}
                                    />
                                </Col> : null}
                                <Col className='mb-1 position-relative'>
                                    <InputAmountField
                                        value={formik.values.variants[0].opening_stock}
                                        placeholder='Opening Stock'
                                        label='Opening Stock'
                                        name={`variants.${0}.opening_stock`}
                                        handleChange={formik.setFieldValue}
                                        handleBlur={formik.setFieldTouched}
                                        autoComplete='off'
                                        disabled={history.location.pathname.includes('view')}
                                        errors={formik.errors.variants && formik.errors?.variants[0]?.opening_stock}
                                        touched={formik.touched.variants && formik.touched?.variants[0]?.opening_stock}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card> : <Card className={`mt-1 mb-0 munim-card-border ${history.location.pathname.includes('view') ? 'munim-filed-disabled' : ''}`}>
                        <CardBody className='p-0'>
                            <div className='munim-card-padding'>
                                <h5 className='m-0'>Variants</h5>
                            </div>
                            <Row className='munim-master-item-variation'>
                                {formik.values.option_name?.map((ele, index) => (
                                    <>
                                        {editVariants && editVariants[index] ?
                                            <Col md='12' className='mb-1 position-relative d-flex align-items-center gap-1 justify-content-between'>
                                                <div className='munim-variation-tag d-flex gap-2 w-100'>
                                                    <div className='munim-tag-heading'>
                                                        <p>{ele}</p>
                                                    </div>
                                                    <div className='munim-tag'>
                                                        {formik.values.option_value[index]?.map(sub_ele => <span>{sub_ele}</span>)}
                                                    </div>
                                                </div>
                                                {!history.location.pathname.includes('view') ? <Button outline
                                                    onClick={() => handleEditVariant(false, index)}
                                                    className='munim-border-bottom-unset munim-add-another-tags cursor-pointer p-0'
                                                >
                                                    Edit
                                                </Button> : null}
                                            </Col> : <>
                                                <Label className='form-label' for='Option Name'>
                                                    Option Name
                                                </Label>
                                                <Col md='12' className='mb-1 position-relative d-flex align-items-center gap-1'>
                                                    <CategorySelect
                                                        name={`option_name.${index}`}
                                                        placeholder='Please select option name'
                                                        dropdownValue={formik.values.option_name[index]}
                                                        dropdownList={optionNameList}
                                                        handleBlur={formik.setFieldTouched}
                                                        handleChangeValue={handleChangeCategory}
                                                        disabled={history.location.pathname.includes('view')}
                                                        isLabelValue={true}
                                                        index={index}
                                                        addNewElement={createVariantOptionName}
                                                        isCreateNewElement={true}
                                                        touched={formik.touched.option_name && formik.touched?.option_name[index]}
                                                        errors={formik.errors.option_name && formik.errors?.option_name[index]}
                                                        isNextData={isNextOptionName}
                                                        setIsNextData={setIsNextOptionName}
                                                        apiPath={CommonApiEndPoint.get_variant_options}
                                                    />
                                                    {!history.location.pathname.includes('view') ? <Trash2 size={20} onClick={() => handleDeleteVariants(index)} /> : null}
                                                </Col>
                                                {formik.values.option_name[index] ? <>
                                                    <Label className='form-label' for='Option Name'>
                                                        Option Value
                                                    </Label>
                                                    {formik.values.option_value[index] && formik.values.option_value[index]?.map((_, sub_index) => (
                                                        <Col md='12' className='mb-1 position-relative d-flex align-items-center gap-1'>
                                                            <InputTextField
                                                                name={`option_value.${index}.${sub_index}`}
                                                                placeholder='Enter value'
                                                                value={formik.values.option_value[index][sub_index]}
                                                                handleChange={formik.setFieldValue}
                                                                disabled={history.location.pathname.includes('view')}
                                                                handleBlur={(name) => {
                                                                    handleShowVariants(name, index, formik.values.option_value[index][sub_index])
                                                                    if (formik.values.option_value[index]?.length > 1 && !formik.values.option_value[index][sub_index]?.length) {
                                                                        handleDeleteVariants(index, sub_index)
                                                                    }
                                                                }}
                                                                autoComplete='off'
                                                                touched={formik.touched.option_value && formik.touched?.option_value[index] && formik.touched?.option_value[index][sub_index]}
                                                                errors={formik.errors.option_value && formik.errors?.option_value[index] && formik.errors?.option_value[index][sub_index]}
                                                            />
                                                            {formik.values.option_value[index]?.length > 1 && formik.values.option_value[index][sub_index] && !history.location.pathname.includes('view') ? <Trash2 size={20} onClick={() => handleDeleteVariants(index, sub_index)} /> : null}
                                                        </Col>
                                                    )
                                                    )}
                                                    {formik.values.option_value[index][formik.values.option_value[index]?.length - 1] && !history.location.pathname.includes('view') && (formik.values.option_value?.flat()?.length <= 100) ? <>
                                                        <Col md='12' className='mb-1 position-relative'>
                                                            <InputTextField
                                                                name='add_more_value'
                                                                placeholder='Add another value'
                                                                value={formik.values.add_more_value}
                                                                handleChange={(name, value) => { formik.setFieldValue(name, value); handleAddOptionValue(index, `option_value.${index}.${formik.values.option_value[index]?.length}`, value) }}
                                                                handleBlur={formik.setFieldValue}
                                                                autoComplete='off'
                                                                disabled={history.location.pathname.includes('view')}
                                                            />
                                                        </Col>
                                                        <div className='d-flex justify-content-between mb-1 munim-bb-btn-group munim-save'>
                                                            <CustomButton
                                                                className='me-1'
                                                                outline
                                                                color='primary'
                                                                type='button'
                                                                label='Done'
                                                                tabIndex="-1"
                                                                handleClick={() => handleEditVariant(true, index)}
                                                            />
                                                        </div>
                                                    </> : null}
                                                </> : null}
                                            </>}
                                    </>
                                )
                                )}
                            </Row>
                            {formik.values.option_name?.length ? <hr className='p-0 m-0' /> : null}
                            {formik.values.option_name?.length < 3 && !history.location.pathname.includes('view') ? <>
                                <div className='d-flex align-items-center munim-gap-6 munim-card-padding'>
                                    <Button outline
                                        id='add_more_option'
                                        onClick={(e) => { e.preventDefault(); handleAddOptionName() }}
                                        className='munim-border-bottom-unset munim-add-another-tags cursor-pointer p-0'
                                    >
                                        <Plus className='font-medium-1' /> Add more variant
                                    </Button>
                                </div>
                                {formik.values.variants?.length ? <hr className='p-0 m-0' /> : null}
                            </> : null}
                            <div className='munim-faqs-card'>
                                <Accordion open={open} toggle={toggle}>
                                    {formik.values.variants && formik.values.variants.map((item, index) => (
                                        <>
                                            <AccordionHeader targetId={index}>
                                                <div className='d-flex justify-content-between w-100'>
                                                    {!history.location.pathname.includes('view') ? <div>
                                                        <Trash2 size={20}
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                setDeleteTitle({ title: item.variant_title, id: item.id })
                                                                handleDeletePopUp()
                                                            }} /><span className='ms-1'>{item?.variant_title}</span>
                                                    </div> : <span>{item?.variant_title}</span>}
                                                    <span className='me-1'>{item?.sales_price}</span>
                                                </div>
                                            </AccordionHeader>
                                            <AccordionBody accordionId={index}>
                                                <Row className='munim-card-padding munim-variation-grid'>
                                                    <Col className='mb-1 position-relative'>
                                                        <InputTextField
                                                            label='SKU'
                                                            name={`variants.${index}.sku`}
                                                            placeholder='SKU'
                                                            value={item.sku}
                                                            handleChange={formik.setFieldValue}
                                                            handleBlur={() => { formik.setFieldTouched(`variants.${index}.sku`); checkExistsMasterSku(index, item.sku?.trim(), formik.initialValues.variants[index]?.sku) }}
                                                            autoComplete='off'
                                                            isRequired={true}
                                                            errors={formik.errors.variants && formik.errors?.variants[index]?.sku}
                                                            touched={formik.touched.variants && formik.touched?.variants[index]?.sku}
                                                            disabled={history.location.pathname.includes('view')}
                                                        />
                                                    </Col>
                                                    <Col className='mb-1 position-relative'>
                                                        <InputAmountField
                                                            value={item.purchase_price}
                                                            placeholder='Purchase Price'
                                                            label='Purchase Price'
                                                            name={`variants.${index}.purchase_price`}
                                                            handleChange={formik.setFieldValue}
                                                            handleBlur={formik.setFieldTouched}
                                                            autoComplete='off'
                                                            disabled={history.location.pathname.includes('view')}
                                                            errors={formik.errors.variants && formik.errors?.variants[index]?.purchase_price}
                                                            touched={formik.touched.variants && formik.touched?.variants[index]?.purchase_price}
                                                        />
                                                    </Col>
                                                    <Col className='mb-1 position-relative'>
                                                        <InputAmountField
                                                            value={item.lisiting_price}
                                                            placeholder='Listing Price'
                                                            label='Listing Price'
                                                            name={`variants.${index}.lisiting_price`}
                                                            handleChange={formik.setFieldValue}
                                                            handleBlur={formik.setFieldTouched}
                                                            autoComplete='off'
                                                            disabled={history.location.pathname.includes('view')}
                                                            errors={formik.errors.variants && formik.errors?.variants[index]?.lisiting_price}
                                                            touched={formik.touched.variants && formik.touched?.variants[index]?.lisiting_price}
                                                        />
                                                    </Col>
                                                    <Col className='mb-1 position-relative'>
                                                        <InputAmountField
                                                            value={item.mrp}
                                                            placeholder='MRP'
                                                            label='MRP'
                                                            name={`variants.${index}.mrp`}
                                                            handleChange={formik.setFieldValue}
                                                            handleBlur={formik.setFieldTouched}
                                                            autoComplete='off'
                                                            disabled={history.location.pathname.includes('view')}
                                                            errors={formik.errors.variants && formik.errors?.variants[index]?.mrp}
                                                            touched={formik.touched.variants && formik.touched?.variants[index]?.mrp}
                                                        />
                                                    </Col>
                                                    <Col className='mb-1 position-relative'>
                                                        <InputAmountField
                                                            value={item.sales_price}
                                                            placeholder='Sales Price'
                                                            label='Sales Price'
                                                            name={`variants.${index}.sales_price`}
                                                            handleChange={formik.setFieldValue}
                                                            handleBlur={formik.setFieldTouched}
                                                            autoComplete='off'
                                                            disabled={history.location.pathname.includes('view')}
                                                            errors={formik.errors.variants && formik.errors?.variants[index]?.sales_price}
                                                            touched={formik.touched.variants && formik.touched?.variants[index]?.sales_price}
                                                        />
                                                    </Col>
                                                    <Col className='mb-1 position-relative'>
                                                        <Label className='form-label' for='Low Stock Warning'>
                                                            Low Stock Warning
                                                        </Label>
                                                        <RadioButton
                                                            name={`variants.${index}.low_stock_warning`}
                                                            value={item.low_stock_warning}
                                                            handleChange={formik.setFieldValue}
                                                            label1='Yes'
                                                            label2='No'
                                                            disabled={history.location.pathname.includes('view')}
                                                        />
                                                    </Col>
                                                    {item.low_stock_warning ? <Col className='mb-1 position-relative'>
                                                        <InputAmountField
                                                            value={item.low_limit_unit}
                                                            placeholder='Low Limit'
                                                            label='Low Limit'
                                                            name={`variants.${index}.low_limit_unit`}
                                                            handleChange={formik.setFieldValue}
                                                            handleBlur={formik.setFieldTouched}
                                                            autoComplete='off'
                                                            disabled={history.location.pathname.includes('view')}
                                                            errors={formik.errors.variants && formik.errors?.variants[index]?.low_limit_unit}
                                                            touched={formik.touched.variants && formik.touched?.variants[index]?.low_limit_unit}
                                                        />
                                                    </Col> : null}
                                                    <Col className='mb-1 position-relative'>
                                                        <InputAmountField
                                                            value={item.opening_stock}
                                                            placeholder='Opening Stock'
                                                            label='Opening Stock'
                                                            name={`variants.${index}.opening_stock`}
                                                            handleChange={formik.setFieldValue}
                                                            handleBlur={formik.setFieldTouched}
                                                            autoComplete='off'
                                                            disabled={history.location.pathname.includes('view')}
                                                            errors={formik.errors.variants && formik.errors?.variants[index]?.opening_stock}
                                                            touched={formik.touched.variants && formik.touched?.variants[index]?.opening_stock}
                                                        />
                                                    </Col>
                                                    <Col className='mb-1 position-relative'>
                                                        <Label className='form-label' for='Feature Image'>
                                                            Image
                                                        </Label>
                                                        <div>
                                                            <label id={`item_img_${index}`} className={`${!history.location.pathname.includes('view') && !item.image ? 'cursor-pointer' : ''} munim-feature-img`}>
                                                                {!item.image ? <Plus size={20} /> : <img src={item.image} width="30" height="30" />}
                                                                <Tooltip
                                                                    placement='top'
                                                                    isOpen={itemImageToolTip && itemImageIndex === index && !history.location.pathname.includes('view') && !item.image}
                                                                    target={`item_img_${index}`}
                                                                    toggle={() => { setItemImageToolTip(!itemImageToolTip); setItemImageIndex(index) }}
                                                                >
                                                                    Click here to upload variant image.
                                                                </Tooltip>
                                                                <Input
                                                                    type="file"
                                                                    onChange={(e) => handleItemimage(e, `variants.${index}.image`, item.image, item.id, `variants_${index}_image`)}
                                                                    onClick={() => { setItemImageToolTip(!itemImageToolTip); setItemImageIndex('') }}
                                                                    hidden
                                                                    id="image_attach"
                                                                    className={`variants_${index}_image`}
                                                                    accept="image/*"
                                                                    disabled={history.location.pathname.includes('view') || item.image}
                                                                />
                                                            </label>
                                                            {item.image && !history.location.pathname.includes('view') ?
                                                                <Trash2 size={20}
                                                                    onClick={e => {
                                                                        e.preventDefault()
                                                                        setDeleteImage({
                                                                            img_name: `variants.${index}.image`,
                                                                            img_value: item.image,
                                                                            img_id: item?.id,
                                                                            img_class: `variants_${index}_image`
                                                                        })
                                                                        handleDeleteImagePopUp()
                                                                    }}
                                                                /> : null}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </AccordionBody>
                                            {formik.values.variants?.length - 1 > index ? <hr className='p-0 m-0' /> : null}
                                        </>
                                    ))}
                                </Accordion>
                            </div>
                        </CardBody>
                    </Card>}
                </Col>
                {loader ? null : <Col lg='3' sm='12' className='mt-4'>
                    <Card className={`mt-1 mb-0 munim-card-border ${history.location.pathname.includes('view') ? 'munim-filed-disabled' : ''}`}>
                        <CardBody>
                            <Row>
                                <Col md='6' className='mb-1 position-relative'>
                                    <Label className='form-label' for='Is Active'>
                                        <div className='d-flex justify-content-start munim-gap-6 munim-tooltip-flex'>
                                            <span>Status</span>
                                            <HelpTooltip id='is_active' label='User can set item status as Active / Inactive using this option. e.g. Suppose this option is marked as Inactive, it will not display.' />
                                        </div>
                                    </Label>
                                    <RadioButton
                                        name='status'
                                        value={formik.values.status}
                                        handleChange={formik.setFieldValue}
                                        label1='Active'
                                        label2='Inactive'
                                        disabled={history.location.pathname.includes('view')}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card className={`mt-1 mb-0 munim-card-border ${history.location.pathname.includes('view') ? 'munim-filed-disabled' : ''}`}>
                        <CardBody>
                            <Row>
                                <Col md='12' className='mb-1 position-relative'>
                                    <Label className='form-label' for='Caregory'>
                                        Category
                                    </Label>
                                    <CategorySelect
                                        name='categories'
                                        placeholder='Please select category'
                                        dropdownValue={formik.values.categories}
                                        dropdownList={categoryList}
                                        handleBlur={formik.setFieldTouched}
                                        handleChangeValue={handleChangeCategory}
                                        disabled={history.location.pathname.includes('view')}
                                        isLabelValue={true}
                                        isNextData={isNextCategories}
                                        setIsNextData={setIsNextCategories}
                                        apiPath={CommonApiEndPoint.get_category}
                                        createNewElement='+ Create New Category'
                                        setFilterValue={setCategoryFilterValue}
                                    />
                                </Col>
                                <Col md='12' className='mb-1 position-relative'>
                                    <Label className='form-label' for='Product Type'>
                                        Product Type
                                    </Label>
                                    <CategorySelect
                                        name='product_type'
                                        placeholder='Please select product type'
                                        dropdownValue={formik.values.product_type}
                                        dropdownList={producTypeList}
                                        handleBlur={formik.setFieldTouched}
                                        handleChangeValue={handleChangeCategory}
                                        disabled={history.location.pathname.includes('view')}
                                        isLabelValue={true}
                                        isNextData={isNextProductType}
                                        setIsNextData={setIsNextProductType}
                                        apiPath={CommonApiEndPoint.get_item_type}
                                        createNewElement='+ Create New Product Type'
                                        setFilterValue={setProductFilterValue}
                                    />
                                </Col>
                                <Col md='12' className='mb-1 position-relative new-item-tag'>
                                    <Label className='form-label' for='Tag'>
                                        Tag
                                    </Label>
                                    <CategorySelect
                                        name='tags'
                                        dropdownValue={formik.values.tags}
                                        dropdownList={tagsList}
                                        handleChangeValue={formik.setFieldValue}
                                        handleBlur={formik.setFieldTouched}
                                        multipleSelect={true}
                                        isCreateNewElement={true}
                                        addNewElement={createTags}
                                        disabled={history.location.pathname.includes('view')}
                                        isNextData={isNextTags}
                                        setIsNextData={setIsNextTags}
                                        apiPath={CommonApiEndPoint.get_tag}
                                        setIsTagsData={setIsTagsData}
                                        isTagsData={isTagsData}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>}
                <Col lg='9' sm='12'>
                    <div className='d-flex justify-content-between mt-1 munim-bb-btn-group munim-save'>
                        <CustomButton
                            className='me-1'
                            outline
                            color='secondary'
                            type='button'
                            label='Cancel'
                            tabIndex="-1"
                            handleClick={() => history.push(CommonRouter.master_item)}
                        />
                        {history.location.pathname.includes('view') ? '' : <CustomButton
                            className='me-1'
                            color='primary'
                            type='button'
                            label='Save'
                            handleClick={handleSubmit}
                            loader={saveLoader}
                            disabled={!formik.dirty}
                        />}
                    </div>
                    {
                        history.location.pathname.includes('view') ? <div className="mt-2 mb-2 munim-tble-shortcutkey-main">
                            <div className='pe-1'>
                                <span className='text-uppercase fw-bolder munim-shortcut-letter munim-shortcutkey-text-clr'>Shortcuts:</span>
                            </div>
                            <div className="munim-sales-tble-shortcutkey">
                                <div>
                                    <span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">{detectOs}</button>
                                        <span className='ps-0'> + </span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">C</button>
                                    </span>
                                    <span className='fw-bold munim-shortcutkey-text-clr'>Cancel</span>
                                </div>
                            </div>
                        </div> : <div className="mt-2 mb-2 munim-tble-shortcutkey-main">
                            <div className='pe-1'>
                                <span className='text-uppercase fw-bolder munim-shortcut-letter munim-shortcutkey-text-clr'>Shortcuts:</span>
                            </div>
                            <div className="munim-sales-tble-shortcutkey">
                                <div>
                                    <span>
                                        <button className="munim-input-key fw-bold">{detectOs}</button>
                                        <span className='ps-0'> + </span>
                                        <button className="munim-input-key fw-bold">S</button>
                                    </span>
                                    <span className='fw-bold munim-shortcutkey-text-clr'>Save</span>
                                </div>
                                <div>
                                    <span>
                                        <button className="munim-input-key fw-bold">{detectOs}</button>
                                        <span className='ps-0'> + </span>
                                        <button className="munim-input-key fw-bold">D</button>
                                    </span>
                                    <span className='fw-bold munim-shortcutkey-text-clr'>Discard</span>
                                </div>
                                <div>
                                    <span>
                                        <button className="munim-input-key fw-bold">{detectOs}</button>
                                        <span className='ps-0'> + </span>
                                        <button className="munim-input-key fw-bold">C</button>
                                    </span>
                                    <span className='fw-bold munim-shortcutkey-text-clr'>Cancel</span>
                                </div>
                            </div>
                        </div>
                    }
                </Col>
            </Row >
            <RouterPrompt show={formik.dirty} when={formik.dirty} content={popUpMessage.cancel_content} title={popUpMessage.discard_title} closeText='Cancel' frwText='Leave Page' />
            <DiscardModal discardPopUpActive={discardPopUpActive} popUpTitle={popUpMessage.discard_title} secondaryLabel='Cancel' popUpContent={popUpMessage.discard_content} primaryLabel='Discard Changes' handleDiscardPopUp={handleDiscardPopUp} />
            {
                categorySidebarOpen ? <CategorySidebar
                    toggleSidebar={categorySidebar}
                    open={categorySidebarOpen}
                    isActiveElement={isActiveElement}
                    filterValue={isActiveElement === 'categories' ? categoryFilterValue : productFilterValue}
                /> : null
            }
            <DeleteModal
                deletePopUpActive={deletePopUpActive}
                popUpTitle={`Delete ${isDeleteImage ? 'Image' : 'Variant'}`}
                loader={saveLoader}
                secondaryLabel='Cancel'
                primaryLabel='Delete'
                popUpContent={isDeleteImage ? 'Are you sure, you want to delete this image.' : `Are you sure, you want to delete this ${deleteTitle?.title} variant?`}
                handleDeletePopUp={isDeleteImage ? handleDeleteImagePopUp : handleDeletePopUp}
            />
        </>
    )
}
export default CreateMasterItem