import React, { useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import { Button, FormFeedback } from 'reactstrap'
import { Box } from '@mui/material'
function MultiSelectWithSearch({ option, name, value, handleChange, handleBlur, touched, errors, disabled, setPageLimit, pageLimit, inputMaxLength, dynamicClassName, handleInputChange, multipleSelect, addNewElement, isCreateNewElement = false, placeholder, setIsShowOptionMenu, isShowOptionMenu = true }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const onInputChange = (e) => {
        if (multipleSelect && e?.target) {
            setSearchValue((oldValue) => {
                if (oldValue !== e.target.value) {
                    handleInputChange(name, e?.target.value)
                    return e.target.value
                } else if (name === 'tags') {
                    handleInputChange(name, '')
                }
            })
        } else if (!multipleSelect) {
            handleInputChange(name, e)
            setSearchValue(e)
        }
    }
    const only_value = Array.isArray(value) && value.length ? value.map(ele => ele.value) : []

    const handleSelectedValue = (name, selectedValue) => {
        const is_action = selectedValue?.map(ele => ele.value)?.includes('0')
        if (is_action) {
            handleChange(name, '0')
        } else {
            setSearchValue('')
            const new_added_value = selectedValue.length && selectedValue[selectedValue.length - 1].value
            if (only_value.length < selectedValue.length && only_value.includes(new_added_value)) {
                const final_data = value.filter(ele => ele.value !== new_added_value)
                handleChange(name, final_data)
            } else {
                handleChange(name, selectedValue)
            }
        }
    }
    const handleScrollOption = (value) => {
        setPageLimit(name, value)
    }
    const renderOption = (props, option) => (
        <>
            <Box component="li" {...props} className='munim-select-auto-complete MuiAutocomplete-option d-flex align-items-center munim-global-user-list munim-mui-check-list'>
                {option.type === 'button' ? <Button style={{ width: '100%' }}>{option.text ? option.text : option.label}</Button> : <>
                    <Checkbox
                        className='p-0'
                        checked={only_value.includes(option.value)}
                    />
                    <p className='iedntix-cursor-pointer fw-bold munim-global-list-label cust-leger-name'>
                        {option.text ? option.text : option.label}
                    </p>
                </>}
            </Box>
        </>
    )
    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            // ** User Pressed ENTER
            if (isCreateNewElement) {
                const isAvailable = option.find(ele => ele.label === searchValue)
                if (isAvailable?.label) {
                    addNewElement(true, name, isAvailable)
                } else if (searchValue?.trim()?.length) {
                    addNewElement(false, name, searchValue?.trim())
                }
                setSearchValue('')
            }
        }
    }
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
            {multipleSelect ? <>
                <Autocomplete
                    open={isOpen}
                    onOpen={() => setIsOpen(true)}
                    onClose={() => setIsOpen(false)}
                    multiple
                    id={name}
                    value={Array.isArray(value) && value.length ? value : []}
                    inputValue={searchValue ? searchValue : ''}
                    className={`munim-MUI-dropdown munim-sidebar-tags ${errors && touched ? 'is-invalid' : ''}`}
                    options={option}
                    disableClearable
                    slotProps={{
                        popper: {
                            className: 'munim-multi-select-mui munim-sidebar-tags-option'
                        }
                    }}
                    renderOption={renderOption}
                    onInputChange={onInputChange}
                    onBlur={handleBlur ? () => handleBlur(name) : () => { }}
                    ListboxProps={{
                        onScroll: (event) => {
                            const listBoxNode = event.currentTarget
                            if (listBoxNode.scrollTop + listBoxNode.clientHeight === listBoxNode.scrollHeight) {
                                handleScrollOption(pageLimit + 1)
                            }
                        },
                        className: dynamicClassName ? `MuiAutocomplete-listbox ${dynamicClassName}` : 'MuiAutocomplete-listbox'
                    }}
                    disabled={disabled}
                    getOptionLabel={(option) => { return option.text ? option.text : option.label }}
                    onChange={!disabled ? (e, value) => { setSearchValue(''); handleSelectedValue(name, value) } : () => { }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputProps={{ ...params.inputProps, maxLength: inputMaxLength ? inputMaxLength : '' }}
                            placeholder={Array.isArray(value) && value.length ? '' : placeholder}
                        />
                    )}
                    disablePortal
                    onKeyDown={onKeyDown}
                    noOptionsText={isCreateNewElement && searchValue ? 'Press Enter to create a new tag' : 'No options'}
                    disableCloseOnSelect
                />
                {
                    errors && touched && (
                        <FormFeedback tooltip={true} className='d-block'>
                            {errors}
                        </FormFeedback>
                    )
                }
            </> : <>
            </>}
        </>
    )
}

export default MultiSelectWithSearch
