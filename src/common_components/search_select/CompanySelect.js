import React, { useState, useEffect } from 'react'
import { GetApiCall } from '../../helper/axios'
import { debounce } from '../../helper/commonFunction'
import SearchSelect from './SearchSelect'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { useSelector } from 'react-redux'

let isLoading = false
const CompanySelect = ({ companyValue, id, handleChange, handleBlur, dynamicClassName, openOnFocus }) => {
    const company_is_next = useSelector((state) => state.commonReducer.company_is_next)
    const companyList = useSelector((state) => state.commonReducer.company_list)
    const [companyDataOption, setCompanyDataOption] = useState([])
    const [companyData, setCompanyData] = useState([])
    const [finalCompanyData, setFinalCompanyData] = useState([])
    const [finalDataList, setFinalDataList] = useState([])
    const [pageLimit, setPageLimit] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isNextItem, setIsNextItem] = useState('0')
    const [isNextForSearch, setIsNextForSearch] = useState('0')
    const [pageLimitForSearch, setPageLimitForSearch] = useState(0)
    /**
     * IW0077
     * this function is call when user search company
     * FUNCTION FOR DROPDOWN WITH API CALL ------ START HERE
    */
    const getCompanyData = async (arg = 0, filterData) => {
        const header = {
            'access-token': localStorage.getItem('access_token')
        }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.company_list}?filter=${filterData ? filterData : ''}&limit=${arg}&per_page=10`, header)
        if (res.data.status === 'success') {
            const company_list = []
            res.data.data.company_data?.map((item) => {
                company_list.push({
                    value: item.comp_id,
                    label: item.alias_name ? `${item.company_name} - ${item.alias_name}` : item.company_name,
                    is_active: item.is_active,
                    registration_type: item.registration_type,
                    gst_in: item.gst_in,
                    className: item.is_active === 0 ? 'munim-company-inactive-danger' : ''
                })
            })
            if (filterData) {
                setCompanyDataOption([...companyDataOption, ...company_list])
                setCompanyData([...companyData, ...res.data.data.company_data])
                setIsNextForSearch(res.data.data.is_next)
            } else {
                setFinalDataList([...finalDataList, ...company_list])
                setFinalCompanyData([...finalCompanyData, ...res.data.data.company_data])
                setIsNextItem(res.data.data.is_next)
            }
        } else {
            setCompanyDataOption([])
            if (filterData) {
                setIsNextForSearch('0')
            } else {
                setIsNextItem('0')
            }
        }
        isLoading = false
    }
    /**
     * IW0077
     * This function is called when user try to search company from company dropdown
     * if input field length is more then 2 char we call getCompanyData for api call to get searchable companyList
     */
    const searchCompany = (e) => {
        if (e?.length) {
            getCompanyData(0, e)
            setSearchTerm(e)
        } else {
            setCompanyDataOption([])
            setSearchTerm('')
            getCompanyData(0, '')
            setPageLimit(0)
        }
    }
    const [searchState] = useState({ fn: debounce(searchCompany, 500) })
    const onInputChange = (e) => {
        searchState.fn(e)
    }

    useEffect(() => {
        if (companyList.length) {
            const company_list = []
            setFinalCompanyData(companyList)
            companyList.map((item) => {
                company_list.push({
                    value: item.comp_id,
                    label: item.alias_name ? `${item.company_name} - ${item.alias_name}` : item.company_name,
                    is_active: item.is_active,
                    registration_type: item.registration_type,
                    gst_in: item.gst_in,
                    className: item.is_active === 0 ? 'munim-company-inactive-danger' : ''
                })
            })
            setIsNextItem(company_is_next)
            setFinalDataList(company_list)
        }
    }, [companyList])
    /**
     * IW0079
     * This function is called when user select the company with search at that time we add that company data to companyList manually for set dropdown data
     */
    const handleAddDataToOption = (name, value) => {
        if (companyValue !== value) {
            let is_data_available = false
            finalCompanyData?.map((element) => {
                if (element.comp_id === value) {
                    handleChange(element)
                    is_data_available = true
                }
            })
            if (!is_data_available) {
                companyData?.map((element) => {
                    if (element.comp_id === value) {
                        handleChange(element)
                        setFinalCompanyData([...finalCompanyData, element])
                        setFinalDataList([
                            ...finalDataList,
                            {
                                value: element.comp_id,
                                label: element.alias_name ? `${element.company_name} - ${element.alias_name}` : element.company_name,
                                is_active: element.is_active,
                                registration_type: element.registration_type,
                                gst_in: element.gst_in,
                                className: element.is_active === 0 ? 'munim-company-inactive-danger' : ''
                            }
                        ])
                    }
                })
            }
            setCompanyDataOption([])
        }
    }
    const handlePageLimit = (page) => {
        if (searchTerm) {
            setPageLimitForSearch((oldPage) => {
                if (oldPage !== page && isNextForSearch === '1') {
                    getCompanyData(page, searchTerm)
                }
                return page
            })
        } else {
            setPageLimit((oldPage) => {
                if (oldPage !== page && isNextItem === '1') {
                    getCompanyData(page, searchTerm)
                }
                return page
            })
        }
    }
    return (
        <>
            <SearchSelect
                id={id}
                value={companyValue}
                options={searchTerm ? companyDataOption : finalDataList}
                handleChange={handleAddDataToOption}
                onInputChange={onInputChange}
                handleBlur={handleBlur}
                item_li_element={true}
                pageLimit={searchTerm ? pageLimitForSearch : pageLimit}
                setPageLimit={handlePageLimit}
                setSearchTerm={setSearchTerm}
                dynamicClassName={dynamicClassName}
                openOnFocus={openOnFocus}
                isNextDataAvailable={isNextItem}
                isLoading={isLoading}
            />
        </>
    )
}

export default CompanySelect
