import React, { useState, useEffect } from 'react'
import { GetApiCall } from '../../helper/axios'
import { debounce } from '../../helper/commonFunction'
import SearchSelect from './SearchSelect'

function CustomerSelect({ name, customerValue, placeholder, customerList, setCustomerList, changeCustomer, disabled, isNext, setIsNext, autoFocus, apiendPoint, createNewElement = '', isLabelValue, addNewElement, isNextData, handleBlur, errors, touched }) {
    const [companyDataOption, setCompanyDataOption] = useState([])
    const [companyData, setCompanyData] = useState([])
    const [finalCompanyList, setFinalCompanyList] = useState([])
    const [pageLimit, setPageLimit] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    /**
    * IW214
    * This function is call when user search company
    */
    const getCompanyData = async (arg = 0, filterData) => {
        const header = {
            'access-token': localStorage.getItem('access_token')
        }
        const res = await GetApiCall('GET', `${apiendPoint}?limit=${arg}&filter=${filterData}&per_page=20`, header)
        if (res.data.status === 'success') {
            setCompanyData(res.data.data.company_data)
            const company_data = [...res.data.data.company_data]
            if (arg !== 0) {
                const merge_data = [...companyData, ...res.data.data.company_data]
                setCompanyData(merge_data)
            }
            setCompanyDataOption(company_data)
            setIsNext(res.data.data.is_next)
        }
    }
    /**
    * IW214
    * This function is called when user try to search company from company dropdown
    */
    const searchCompany = (e) => {
        if (e?.length) {
            setSearchTerm(e)
            getCompanyData(0, e)
        } else {
            setCompanyDataOption([])
            setCustomerList([])
            setSearchTerm('')
            setPageLimit(0)
            getCompanyData(0, '')
        }
    }
    const [searchState] = useState({ fn: debounce(searchCompany, 500) })
    const onInputChange = (e) => {
        searchState.fn(e)
    }
    useEffect(() => {
        setFinalCompanyList(customerList)
    }, [customerList])
    useEffect(() => {
        if (companyDataOption?.length) {
            if (searchTerm?.length) {
                setCustomerList([...companyDataOption])
            } else {
                setCustomerList([...customerList, ...companyDataOption])
            }
        } else {
            setFinalCompanyList(customerList)
        }
    }, [companyDataOption])
    /**
    * IW214
    * This effect is called when user scroll the company data list from company dropdown then add new fetch company data in dropdown list
    */
    useEffect(() => {
        if (pageLimit && isNext === '1') {
            setTimeout(() => {
                getCompanyData(pageLimit, searchTerm)
            }, 300)
        }
    }, [pageLimit])
    /**
    * IW214
    * This function is called when user select the company with search at that time we add that company data to customerList manually for set dropdown data
    */
    const handleAddDataToOption = (name, value) => {
        if (value !== customerValue) {
            let is_data_available = false
            customerList?.find(ele => {
                if (ele.value === value) {
                    changeCustomer(ele, false)
                    is_data_available = true
                    return true
                }
            })
            if (!is_data_available) {
                companyData?.find(ele => {
                    if (ele.value === value) {
                        changeCustomer(ele, true)
                        return true
                    }
                })
            }
            setCompanyDataOption([])
        }
    }
    return (
        <>
            <SearchSelect
                disabled={disabled}
                showOnlyLabel={true}
                id={name}
                placeholder={placeholder}
                value={customerValue}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                autoFocus={autoFocus}
                createNewElement={createNewElement}
                isLabelValue={isLabelValue}
                options={finalCompanyList}
                handleChange={handleAddDataToOption}
                onInputChange={onInputChange}
                pageLimit={pageLimit}
                setPageLimit={setPageLimit}
                setSearchTerm={setSearchTerm}
                addNewElement={(value) => addNewElement(value, index)}
                setIsNext={setIsNext}
                isNextDataAvailable={isNextData}
            />
        </>
    )
}

export default CustomerSelect