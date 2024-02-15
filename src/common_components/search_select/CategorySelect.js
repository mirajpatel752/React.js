import React, { useState, useEffect } from 'react'
import { GetApiCall } from '../../helper/axios'
import { debounce } from '../../helper/commonFunction'
import SearchSelect from './SearchSelect'
import MultiSelectWithSearch from '../custom_field/MultiSelectWithSearch'

let isLoading = false
const CategorySelect = ({ dropdownValue, disabled, name, dropdownList, handleChangeValue, handleBlur, touched, errors, autoFocus, isLabelValue, index, addNewElement, isCreateNewElement, isNextData, setIsNextData, apiPath, createNewElement = '', placeholder, setFilterValue, multipleSelect = false, isTagsData, setIsTagsData }) => {
    const [itemDataOption, setItemDataOption] = useState([])
    const [itemData, setItemData] = useState([])
    const [finalDataList, setFinalDataList] = useState([])
    const [pageLimit, setPageLimit] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchData = async (limit = 0, filterData = '') => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${apiPath}?is_action=1&filter=${filterData}&limit=${limit}&per_page=25`, header)
        if (res.data.status === 'success') {
            setIsNextData(res.data.data.is_next)
            setItemData(res.data.data.row_data)
            const item_data = []
            if (limit === 0) {
                res.data.data.row_data.map((item) => {
                    if (name === 'categories') {
                        item_data.push({ value: item.id, label: item.categories, customAbbreviation: { label: item.categories } })
                    } else if (name === 'product_type') {
                        item_data.push({ value: item.id, label: item.types, customAbbreviation: { label: item.types } })
                    } else if (name === 'tags') {
                        item_data.push({ value: item.id, label: item.tags })
                    } else {
                        item_data.push({ value: item.id, label: item.options, customAbbreviation: { label: item.options } })
                    }
                })
                setItemDataOption(item_data)
            } else {
                const merge_data = [...itemData, ...res.data.data.row_data]
                setItemData(merge_data)
                merge_data.map(item => {
                    if (name === 'categories') {
                        item_data.push({ value: item.id, label: item.categories, customAbbreviation: { label: item.categories } })
                    } else if (name === 'product_type') {
                        item_data.push({ value: item.id, label: item.types, customAbbreviation: { label: item.types } })
                    } else if (name === 'tags') {
                        item_data.push({ value: item.id, label: item.tags })
                    } else {
                        item_data.push({ value: item.id, label: item.options, customAbbreviation: { label: item.options } })
                    }
                })
                setItemDataOption(item_data)
            }
        } else {
            if (createNewElement && setFilterValue) {
                setFilterValue(filterData)
                setItemDataOption([
                    {
                        value: '0',
                        label: createNewElement,
                        type: 'button',
                        color: 'flat-success'
                    }
                ])
            } else {
                setItemDataOption([])
            }
            setPageLimit(0)
            // setIsNextData('0')
        }
        isLoading = false
    }

    const searchItemData = (value) => {
        if (value?.length) {
            fetchData(0, value)
            setSearchTerm(value)
        } else {
            setItemDataOption([])
            setSearchTerm('')
            setPageLimit(0)
        }
    }
    const [searchState] = useState({ fn: debounce(searchItemData, 500) })
    const onInputChange = (value) => {
        searchState.fn(value)
    }
    /**
   * IW0110
   * This effect is called when user scroll the dropdown data list from dropdown then add new fetch data in dropdown list
   */
    useEffect(() => {
        if (pageLimit && isNextData === '1') {
            if (isLoading) {
                return
            }
            isLoading = true
            setTimeout(() => {
                fetchData(pageLimit, searchTerm)
            }, 300)
        }
    }, [pageLimit])
    useEffect(() => {
        if (itemDataOption?.length) {
            if (searchTerm?.length) {
                setFinalDataList([...itemDataOption])
            } else {
                setFinalDataList([...dropdownList, ...itemDataOption])
            }
        } else {
            if (['categories', 'product_type', 'tags'].includes(name)) setFinalDataList(dropdownList)
            else if (searchTerm?.length && !itemDataOption.length) setFinalDataList([])
            else setFinalDataList(dropdownList)
        }
    }, [itemDataOption, dropdownList])

    const handleAddDataToOption = (name, value, option) => {
        if (value === '0') {
            handleChangeValue(value, '', name, option?.label, index)
        } else if (dropdownValue !== value) {
            const item_data_option = [...dropdownList]
            let is_data_available = false
            item_data_option.find((element) => {
                if (element.value === value) {
                    handleChangeValue(value, '', name, option?.label, index)
                    is_data_available = true
                    return true
                }
            })
            if (!is_data_available) {
                itemData.find((element) => {
                    if (element.id === value) {
                        handleChangeValue(value, element, name, option?.label, index)
                        item_data_option.push(element)
                        return true
                    }
                })
            }
            setItemDataOption([])
        }
    }
    /**
     * IW0110
     * Here comes when get tags data using lazy loading
     */
    const handleApiPageLimit = (name, value) => {
        setPageLimit(value)
        if (value && isNextData === '1') {
            if (isLoading) {
                return
            }
            isLoading = true
            setTimeout(() => {
                fetchData(value, searchTerm)
            }, 300)
        }
    }
    /**
   * IW0110
   * This effect is called when a user searches for tag data and immediately use the enter key then blank the data
   */
    useEffect(() => {
        if (isTagsData) {
            setItemDataOption([])
            setSearchTerm('')
            setPageLimit(0)
            setIsTagsData(false)
        }
    }, [isTagsData])
    /**
     * IW0110
     * This function is called when user select or create new tag with enter key 
     */
    const handleAddNewElement = (flag, name, value) => {
        if (flag) {
            let is_data_available = false
            const item_data_option = [...dropdownList]
            const available_tag = item_data_option.find(ele => ele.label === value.label)
            if (available_tag?.label) {
                const already_tags = dropdownValue?.filter(ele => ele.label === value.label)
                if (already_tags?.length) {
                    const filter_tags = dropdownValue?.filter(ele => ele.label !== value.label)
                    handleChangeValue(name, filter_tags)
                } else {
                    handleChangeValue(name, [...dropdownValue, available_tag])
                }
                is_data_available = true
                setTimeout(() => { setIsTagsData(true) }, 600)
            }
            if (!is_data_available) {
                itemData.find(element => {
                    if (element.id === value.value) {
                        addNewElement(true, name, value)
                        item_data_option.push(element)
                        return true
                    }
                })
            }
        } else {
            addNewElement(false, name, value)
        }
    }
    /**
     * IW0110
     * This function is called when user select tags value 
     */
    const handleChangeTags = (name, value) => {
        const initialList = [...dropdownList]
        const different_list = value?.filter(({ value: id1 }) => !initialList.some(({ value: id2 }) => id2 === id1))
        if (different_list.length) {
            addNewElement(true, name, different_list[0])
        } else {
            handleChangeValue(name, value)
        }
    }

    return (
        <>
            {multipleSelect ? <MultiSelectWithSearch
                name={name}
                value={dropdownValue}
                option={finalDataList}
                handleChange={handleChangeTags}
                handleInputChange={(_, value) => onInputChange(value)}
                handleBlur={handleBlur}
                multipleSelect={true}
                pageLimit={pageLimit}
                setPageLimit={handleApiPageLimit}
                addNewElement={handleAddNewElement}
                isCreateNewElement={true}
                disabled={disabled}
            /> : <SearchSelect
                id={name}
                value={dropdownValue}
                placeholder={placeholder}
                options={finalDataList}
                handleChange={handleAddDataToOption}
                onInputChange={onInputChange}
                disabled={disabled}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                autoFocus={autoFocus}
                createNewElement={createNewElement}
                isLabelValue={isLabelValue}
                addNewElement={(value) => addNewElement(value, index)}
                isCreateNewElement={isCreateNewElement}
                item_li_element={true}
                isLoading={isLoading}
                pageLimit={pageLimit}
                setPageLimit={setPageLimit}
                setSearchTerm={setSearchTerm}
                setIsNext={setIsNextData}
                isNextDataAvailable={isNextData}
            />}
        </>
    )
}

export default CategorySelect
