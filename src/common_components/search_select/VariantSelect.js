import React, { useState, useEffect } from 'react'
import { GetApiCall } from '../../helper/axios'
import { debounce } from '../../helper/commonFunction'
import SearchSelect from './SearchSelect'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'

let isLoading = false
const CategorySelect = ({ dropdownValue, disabled, name, dropdownList, handleChangeValue, handleBlur, touched, errors, autoFocus, isNextData, setIsNextData, createNewElement = '', placeholder, setNewOptionPageLimit, newOptionPageLimit, setNewOptionData, setIsShowOptionMenu, isShowOptionMenu }) => {
    const [itemDataOption, setItemDataOption] = useState([])
    const [itemData, setItemData] = useState([])
    const [finalDataList, setFinalDataList] = useState([])
    const [pageLimit, setPageLimit] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    /**
    * IW0110
    * This function is get master item data list
    */
    const fetchData = async (limit = 0, filterData = '') => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_master_item_data_list}?is_action=1&filter=${filterData}&limit=${limit}&per_page=25`, header)
        if (res.data.status === 'success') {
            setIsNextData(res.data.data.is_next)
            setItemData(res.data.data.row_data)
            const item_data = []
            if (limit === 0) {
                res.data.data.row_data.map((item) => {
                    item_data.push({ value: item.sku, label: item.title, image: item.image, customAbbreviation: { label: item.title } })
                })
                setItemDataOption(item_data)
                if (setNewOptionData) setNewOptionData(item_data)
            } else {
                const merge_data = [...itemData, ...res.data.data.row_data]
                setItemData(merge_data)
                merge_data.map(item => {
                    item_data.push({ value: item.sku, label: item.title, image: item.image, customAbbreviation: { label: item.title } })
                })
                setItemDataOption(item_data)
                if (setNewOptionData) setNewOptionData(item_data)
            }
        } else {
            setItemDataOption([])
            setPageLimit(0)
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
            if (setNewOptionPageLimit) setNewOptionPageLimit(pageLimit)
            if (isLoading) {
                return
            }
            isLoading = true
            setTimeout(() => {
                fetchData(pageLimit + newOptionPageLimit, searchTerm)
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
            if (searchTerm?.length) setFinalDataList([])
            else setFinalDataList(dropdownList)
        }
    }, [itemDataOption, dropdownList])
    /**
    * IW0110
    * This function is handle item change option
    */
    const handleAddDataToOption = (name, value) => {
        if (value === '0') {
            handleChangeValue(value, '')
        } else if (dropdownValue !== value) {
            const item_data_option = [...dropdownList]
            let is_data_available = false
            item_data_option.find((element) => {
                if (element.value === value) {
                    handleChangeValue(value, '')
                    is_data_available = true
                    return true
                }
            })
            if (!is_data_available) {
                itemData.find((element) => {
                    if (element.sku === value) {
                        handleChangeValue(value, element)
                        item_data_option.push(element)
                        return true
                    }
                })
            }
            setItemDataOption([])
        }
    }

    return (
        <SearchSelect
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
            item_li_element={true}
            isLoading={isLoading}
            pageLimit={pageLimit}
            setPageLimit={setPageLimit}
            setSearchTerm={setSearchTerm}
            setIsNext={setIsNextData}
            isNextDataAvailable={isNextData}
            isShowOptionMenu={isShowOptionMenu}
            setIsShowOptionMenu={setIsShowOptionMenu}
        />
    )
}

export default CategorySelect
