import React, { useState, useEffect } from 'react'
import { GetApiCall } from '../../helper/axios'
import { debounce } from '../../helper/commonFunction'
import SearchSelect from './SearchSelect'

let isLoading = false
const ChannelSelect = ({ dropdownValue, disabled, name, dropdownList, handleChangeValue, handleBlur, touched, errors, autoFocus, isNextData, setIsNextData, apiPath, placeholder, companyId, channelType }) => {
    const [itemDataOption, setItemDataOption] = useState([])
    const [itemData, setItemData] = useState([])
    const [finalDataList, setFinalDataList] = useState([])
    const [pageLimit, setPageLimit] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchData = async (limit = 0, filterData = '') => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${apiPath}?is_action=3&filter=${filterData}&limit=${limit}&per_page=25&id=${companyId}&channel_type=${channelType}`, header)
        if (res.data.status === 'success') {
            setIsNextData(res.data.data.is_next)
            setItemData(res.data.data.row_data)
            const item_data = []
            if (limit === 0) {
                res.data.data.row_data.map((item) => {
                    item_data.push({ value: item.id, label: item.product_name, customAbbreviation: { label: item.product_name } })
                })
                setItemDataOption(item_data)
            } else {
                const merge_data = [...itemData, ...res.data.data.row_data]
                setItemData(merge_data)
                merge_data.map(item => {
                    item_data.push({ value: item.id, label: item.product_name, customAbbreviation: { label: item.product_name } })
                })
                setItemDataOption(item_data)
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
   * IW0214
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
            setFinalDataList(dropdownList)
        }
    }, [itemDataOption, dropdownList])

    const handleAddDataToOption = (name, value) => {
        if (value === '0') {
            handleChangeValue(value)
        } else if (dropdownValue !== value) {
            const item_data_option = [...dropdownList]
            let is_data_available = false
            item_data_option.find((element) => {
                if (element.value === value) {
                    handleChangeValue(value)
                    is_data_available = true
                    return true
                }
            })
            if (!is_data_available) {
                itemData.find((element) => {
                    if (element.id === value) {
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
        <>
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
                item_li_element={true}
                isLoading={isLoading}
                pageLimit={pageLimit}
                setPageLimit={setPageLimit}
                setSearchTerm={setSearchTerm}
                setIsNext={setIsNextData}
                isNextDataAvailable={isNextData}
            />
        </>
    )
}

export default ChannelSelect
