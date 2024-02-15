import React, { useEffect, useState } from "react"
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Button, FormFeedback, Tooltip } from "reactstrap"
import { Box } from "@mui/material"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import CommonRouter from "../../helper/commonRoute"

const SearchSelect = ({ id, value, placeholder, options, setPageLimit, pageLimit, handleChange, onInputChange, setSearchTerm, errors, touched, disabled, item_li_element, autoFocus, consumption_item, handleBlur, createNewElement, inputMaxlength, dynamicClassName, handleFocus, openOnFocus, showOnlyLabel, isFromFilterPanel, isNextDataAvailable, isLoading, isLabelValue = false, addNewElement, isCreateNewElement = false, setIsShowOptionMenu, isShowOptionMenu = true }) => {
    const history = useHistory()
    const [isOpen, setIsOpen] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [tooltipShowIndex, setTooltipShowIndex] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [isShowValue, setIsShowValue] = useState(1)
    const [isScrolling, setIsScrolling] = useState(false)
    const [tabChange, setTabChange] = useState(false)
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    /**
    * IW0110
    * This function is called when user pressed the keyboard key
    */
    const onKeyDown = (e) => {
        setTooltipOpen(false)
        if (e.keyCode === 40) {
            // ** User pressed the down arrow
            if (Number((document.getElementsByClassName('MuiAutocomplete-option MuiBox-root css-0 Mui-focused')[0]?.id)?.split('-')[4]) === (options?.length - 2)) {
                setPageLimit(pageLimit + 1)
            }
        } else if (e.keyCode === 13) {
            // ** User Pressed ENTER
            setIsOpen(true)
            const is_available_data = options.find(ele => ele.label === inputValue)
            if (isCreateNewElement && inputValue?.trim()?.length && is_available_data === undefined) {
                addNewElement(inputValue?.trim())
                setInputValue('')
                setSearchTerm('')
                setIsOpen(false)
            }
        } else if (e.keyCode === 9) {
            // ** User Pressed Tab
            setSearchTerm('')
            setPageLimit(0)
            setInputValue('')
            setIsShowValue(1)
        } else if (e.altKey) {
            // ** when user change window using alt + tab key
            if (inputValue.length) {
                setTabChange(true)
            }
        } else if (e.keyCode === 45 && options[0]?.type === 'button') {
            handleChange(id, '0')
        }
    }
    /**
   * IW0110
   * This function is apply to option on the li element 
   */
    const renderOption = (props, option) => (<>
        <Box component="li" {...props}>
            {openOnFocus || showOnlyLabel ? <div className="d-flex justify-content-between gap-1 w-100">
                <div className="cust-flex-sec-name fw-normal">
                    <span className={`cust-leger-name ${id === 'company' && !option.is_active ? 'inactive-danger' : ''}`}>{option.text ? option.text : option.label}</span>
                    {id === 'company' && !option.is_active ? <><small className='text-danger fw-bold px-1'>(Inactive)</small> </> : ''}
                    <br />
                    {(option.registration_type || option.gst_in) && <span className='cust-leger-name'>
                        {option.registration_type === '1' ? 'Regular.' : option.registration_type === '2' ? 'Composition.' : option.registration_type === '3' ? 'Consumer.' : option.registration_type === '4' ? 'Unregistered.' : 'Unknown.'}
                        {option.gst_in ? ` GSTIN: ${option.gst_in}` : ''}
                    </span>}
                </div>
            </div> : <>
                {option.type === 'button' ? <Button style={{ width: '100%' }}>{option.text ? option.text : option.label}</Button> : <>
                    {item_li_element ? option.customAbbreviation?.label ? <div className="d-flex justify-content-between gap-1 w-100">
                        <div className="cust-flex-sec-name">
                            <span className="cust-leger-name">{option.customAbbreviation?.label}</span>
                        </div>
                    </div> : <div id={`item_id_${option?.value}`} className="d-flex justify-content-between flex-column w-100">
                        <div className="cust-flex-sec-name">
                            <span className="cust-leger-name"><b>{option.customAbbreviation?.item_name}</b></span>
                        </div>
                        <div className="d-flex munim-gap-manual">
                            <span className="cust-mobile-number">{Number(option.customAbbreviation?.item_type) === 0 ? <b>Product</b> : <b>Service</b>}</span> <span> {selected_company_object.gst_in ? (Number(option.customAbbreviation?.item_type) === 0 ? '| HSN :' : '| SAC :') : ''} {option.customAbbreviation?.hsn_sac_code}</span>
                            <span>{Number(option.customAbbreviation?.item_type) === 0 ? <div className="cust-balance cust-flex-sec-balance "> | {option.customAbbreviation?.balance_qty}</div> : ''}</span>
                            <span>{history.location.pathname.includes('/sales') || history.location.pathname.includes(CommonRouter.quotation) ? `| ${option.customAbbreviation?.sales_price}` : history.location.pathname.includes('/purchase') ? `| ${option.customAbbreviation?.purchase_price}` : history.location.pathname.includes(CommonRouter.stock_journal) && consumption_item ? `| ${option.customAbbreviation?.rate}` : ''}</span>
                        </div>
                        <Tooltip
                            placement='top'
                            isOpen={tooltipOpen && tooltipShowIndex === option?.value}
                            target={`item_id_${option?.value}`}
                            toggle={() => { setTooltipOpen(!tooltipOpen); setTooltipShowIndex(option?.value) }}
                        >
                            {
                                <div>
                                    {option.customAbbreviation?.item_name}
                                    <div>
                                        {Number(option.customAbbreviation?.item_type) === 0 ? 'Product' : 'Service'} {selected_company_object.gst_in ? (Number(option.customAbbreviation?.item_type) === 0 ? '| HSN :' : '| SAC :') : ''} {option.customAbbreviation?.hsn_sac_code}
                                        <div> {Number(option.customAbbreviation?.item_type) === 0 ? `| Stock: ${option.customAbbreviation?.balance_qty}` : ''} {option.customAbbreviation?.mrp !== '' && !history.location.pathname.includes(CommonRouter.stock_journal) ? `| MRP : ${option.customAbbreviation?.mrp}` : ''} {history.location.pathname.includes('/sales') || history.location.pathname.includes(CommonRouter.quotation) ? `| Rate: ${option.customAbbreviation?.sales_price}` : history.location.pathname.includes('/purchase') ? `| Rate: ${option.customAbbreviation?.purchase_price}` : history.location.pathname.includes(CommonRouter.stock_journal) && consumption_item ? `| Rate: ${option.customAbbreviation?.rate}` : ''}
                                        </div>
                                    </div>
                                </div>}
                        </Tooltip>
                    </div> : <div id={`id_${option.customAbbreviation?.id}`} className="w-100">
                        <div className="d-flex justify-content-between gap-1">
                            <div className="cust-flex-sec-name">
                                <span className="cust-leger-name">{option.customAbbreviation?.ledger_name}</span>
                                {option.customAbbreviation?.ledger_short_name ? <span className="cust-short-name">{`(${option.customAbbreviation?.ledger_short_name})`}</span> : ''}
                            </div>
                            <div className="cust-balance cust-flex-sec-balance ">{option.customAbbreviation?.balance}</div>
                        </div>
                        {option.customAbbreviation?.mobile_no ? <div className="cust-mobile-number w-100">Mo.: {option.customAbbreviation?.mobile_no}</div> : ''}
                        <div className="cust-add mx-1 w-100">{option.customAbbreviation?.address_line1 ? ` ${option.customAbbreviation?.address_line1},` : ''}
                            {option.customAbbreviation?.address_line2 ? ` ${option.customAbbreviation?.address_line2},` : ''}
                            {option.customAbbreviation?.city_name ? ` ${option.customAbbreviation?.city_name},` : ''}
                            {option.customAbbreviation?.state_name ? ` ${option.customAbbreviation?.state_name}` : ''}
                        </div>
                        <Tooltip
                            placement='right'
                            isOpen={tooltipOpen && tooltipShowIndex === option.customAbbreviation?.id}
                            target={`id_${option.customAbbreviation?.id}`}
                            toggle={() => { setTooltipOpen(!tooltipOpen); setTooltipShowIndex(option.customAbbreviation?.id) }}
                        >
                            <div className="w-100 customer-product-tooltip">
                                <div className="cust-flex-sec-name">
                                    <span className="cust-leger-name">{option.customAbbreviation?.ledger_name}</span>
                                    {option.customAbbreviation?.ledger_short_name ? <span className="cust-short-name">{`(${option.customAbbreviation?.ledger_short_name})`}</span> : ''}
                                </div>
                                <div className="cust-balance cust-flex-sec-balance ">{option.customAbbreviation?.balance}</div>
                            </div>
                            {option.customAbbreviation?.mobile_no ? <div className="cust-mobile-number w-100">Mo.: {option.customAbbreviation?.mobile_no}</div> : ''}
                            <div className="cust-add mx-1 w-100">{option.customAbbreviation?.address_line1 ? ` ${option.customAbbreviation?.address_line1},` : ''}
                                {option.customAbbreviation?.address_line2 ? ` ${option.customAbbreviation?.address_line2},` : ''}
                                {option.customAbbreviation?.city_name ? ` ${option.customAbbreviation?.city_name},` : ''}
                                {option.customAbbreviation?.state_name ? ` ${option.customAbbreviation?.state_name}` : ''}
                            </div>
                        </Tooltip>
                    </div>}
                </>}
            </>}
        </Box>
    </>
    )
    let values
    if (isLabelValue) {
        values = options?.find(ele => ele.label === value)
    } else {
        values = isFromFilterPanel ? value : options?.find(ele => ele.value === value)
    }
    const handleInputChange = (e) => {
        setTooltipOpen(false)
        if (e?.target.value !== createNewElement) {
            if (e?.target.value && (e?.keyCode !== 13 && e?.keyCode !== 45)) {
                onInputChange(e.target.value)
                setInputValue(e.target.value)
                setIsShowValue(1)
            } else if (e?.target.value !== undefined) {
                setIsShowValue(0)
                setInputValue('')
                onInputChange('')
            } else {
                onInputChange('')
                setIsShowValue(1)
            }
        }
    }

    const handleScrolling = (e) => {
        if ((e.scrollHeight - e.scrollTop - e.clientHeight < 5) && isNextDataAvailable && !isLoading) {
            setIsScrolling(true)
        } else {
            setIsScrolling(false)
        }
    }
    useEffect(() => {
        if (isScrolling) {
            setPageLimit(pageLimit + 1)
        }
    }, [isScrolling])
    /**
     * IW0110
     * This effect is called when the user scrolls through the list, of the dropdown option menu is present, it will be hidden.
     */
    useEffect(() => {
        if (!isShowOptionMenu) {
            setIsOpen(false)
            setIsShowOptionMenu(true)
        }
    }, [isShowOptionMenu])
    return (
        <>
            <Autocomplete
                id={id}
                value={isShowValue ? inputValue?.length ? inputValue : values?.value ? values : '' : ''}
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => { if (!tabChange) { setIsOpen(false) } else { setIsOpen(true) }; setTabChange(false); setSearchTerm(''); setPageLimit(0); setTooltipShowIndex(''); if (!tabChange) { setInputValue('') }; setIsShowValue(1) }}
                options={options}
                openOnFocus={openOnFocus}
                autoHighlight
                disableClearable
                disablePortal
                disabled={disabled}
                className={`${disabled ? 'munim-MUI-dropdown munim-mui-disabled-dropdown' : 'munim-MUI-dropdown'}`}
                sx={{ width: '100%' }}
                onKeyDown={onKeyDown}
                renderOption={renderOption}
                onBlur={handleBlur ? () => handleBlur(id) : () => { }}
                onChange={!disabled ? (_, values) => { handleChange(id, isFromFilterPanel ? values : values.value, values); setInputValue('') } : () => { }}
                onInputChange={(e) => handleInputChange(e)}
                onFocus={handleFocus}
                noOptionsText={isCreateNewElement && inputValue ? 'Press Enter to create a new name' : 'No options'}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder={disabled && history.location.pathname.includes('view') ? '-' : placeholder}
                        className={`${errors && touched && 'munim-sales-invalid'}`}
                        autoFocus={autoFocus}
                        inputProps={{ ...params.inputProps, maxLength: inputMaxlength ? inputMaxlength : '' }}
                    />
                )}
                ListboxProps={{
                    onScroll: (event) => {
                        setTooltipOpen(false)
                        // const listBoxNode = event.currentTarget
                        // if (listBoxNode.scrollTop + listBoxNode.clientHeight >= (listBoxNode.scrollHeight - 5) || listBoxNode.scrollTop + listBoxNode.clientHeight === listBoxNode.scrollHeight) {
                        //     setPageLimit(pageLimit + 1)
                        // }
                        if (event.target.scrollTop) {
                            handleScrolling(event.target)
                        }
                    },
                    className: dynamicClassName ? `MuiAutocomplete-listbox ${dynamicClassName}` : 'MuiAutocomplete-listbox'
                }}
                getOptionLabel={(option) => {
                    if (typeof option === "string") {
                        return option
                    }
                    if (option.inputValue) {
                        return option.inputValue
                    }
                    return option.text ? option.text : option.label
                }}
                filterOptions={(options, params) => {
                    let filtered = []
                    if (!history.location.pathname.includes('return')) {
                        const filterNotEqualData = options?.filter(ele => ele.label !== params.inputValue)
                        const filterEqualData = options?.filter(ele => ele.label === params.inputValue)
                        filtered = !inputValue?.length ? [...filterNotEqualData] : [...filterNotEqualData, ...filterEqualData]
                    } else {
                        options.forEach((element) => {
                            if (
                                element.label?.toLowerCase().includes(params.inputValue.toLowerCase())
                            ) filtered.push(element)
                        })
                    }
                    return filtered
                }}
            />
            {
                errors && touched && (
                    <FormFeedback tooltip={true} className='d-block multiautocomplete-error-message'>
                        {errors}
                    </FormFeedback>
                )
            }
        </>
    )
}

export default SearchSelect
