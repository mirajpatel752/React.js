import React, { useEffect, useState } from 'react'
import Sidebar from '@components/sidebar'
import { CardBody, Input, Spinner } from 'reactstrap'
import CustomButton from './custom_field/CustomButton'
import Hotkeys from 'react-hot-keys'
import { debounce, getIcon, handlePageRefresh } from '../helper/commonFunction'
import { GetApiCall } from '../helper/axios'
import InputCheckBoxField from './custom_field/InputCheckBoxField'
import { bucketPathUrl } from '../helper/commonApi'

let isLoading = false
let isApplyData = true
let isApplyPageLimit = 0
const SearchItemSidebar = ({ open, toggleSidebar, itemList, selectedItemtId, selectedItemValue, isNextData, apiPath, multipleSelect = false, selectedItemData = [], name, sidebarPageLimit }) => {
    const [selectedItem, setSelectedItem] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [dataList, setDataList] = useState([])
    const [finalDataList, setFinalDataList] = useState([])
    const [pageLimit, setPageLimit] = useState(0)
    const [isNextItemData, setIsNextItemData] = useState('1')
    const [itemWindowHeight, setItemWindowHeight] = useState('')
    const [isNextInitialData, setIsNextInitialData] = useState('1')
    /**
    * IW0110
    * This function is used to get master item data list
    */
    const fetchData = async (limit = 0, filterData = '') => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${apiPath}?is_action=1&filter=${filterData}&limit=${limit}&per_page=25`, header)
        if (res.data.status === 'success') {
            setIsNextItemData(res.data.data.is_next)
            if (!filterData) setIsNextInitialData(res.data.data.is_next)
            const item_data = []
            if (limit === 0) {
                res.data.data.row_data.map((item) => {
                    if (name === 'bulk_master_item') {
                        item_data.push({ value: item.id, label: item.product_name, image: item.image })
                    } else if (name === 'channel_product_item') {
                        item_data.push({ value: item.sku, label: item.title, image: item.image })
                    }
                })
                setDataList(item_data)
            } else {
                const merge_data = [...dataList, ...res.data.data.row_data]
                merge_data.map((item) => {
                    if (name === 'bulk_master_item') {
                        item_data.push({ value: item.id ? item.id : item.value, label: item.product_name ? item.product_name : item.label, image: item.image })
                    } else if (name === 'channel_product_item') {
                        item_data.push({ value: item.sku ? item.sku : item.value, label: item.title ? item.title : item.label, image: item.image })
                    }
                })
                setDataList(item_data)
            }
        } else {
            setDataList([])
            setPageLimit(0)
            isApplyPageLimit = 0
        }
        isLoading = false
    }
    /**
     * IW0110
     * This function is called when user try to search item from item list
     */
    const handleSearch = (e) => {
        if (e.length) {
            setPageLimit(0)
            fetchData(0, e)
        } else {
            setDataList([])
            setPageLimit(0)
            if (isNextInitialData === '1') setIsNextItemData('1')
        }
        document.getElementById('scrolling_item').scroll(0, 0)
        isApplyPageLimit = 0
    }
    const [searchState] = useState({ fn: debounce(handleSearch, 500) })
    const handleFilter = (e) => {
        setSearchTerm(e)
        searchState.fn(e)
    }
    /**
    * IW0110
    * This function used when user scrolling & element id is scrolling_item
    */
    const itemScrollerEvent = () => {
        const ele = document.getElementById('scrolling_item')
        const dawnHeight = ele?.scrollHeight - ele?.clientHeight - ele?.scrollTop
        setItemWindowHeight(dawnHeight)
    }
    useEffect(() => {
        if ([0, 1].includes(itemWindowHeight) && !isLoading && isNextItemData === '1') {
            const page = pageLimit + 1
            setPageLimit(page)
            setItemWindowHeight('')
        }
    }, [itemWindowHeight, isNextItemData])
    useEffect(() => {
        window.addEventListener("scroll", itemScrollerEvent)
        return function () {
            window.removeEventListener("scroll", itemScrollerEvent)
        }
    }, [])
    /**
    * IW0110
    * This effect call on when update pageLimit
    */
    useEffect(() => {
        if (pageLimit && ((!searchTerm.length && isNextData === '1') || searchTerm.length)) {
            isLoading = true
            setTimeout(() => {
                if (searchTerm.length) fetchData(pageLimit, searchTerm)
                else fetchData(pageLimit + isApplyPageLimit, searchTerm)
            }, 300)
        }
    }, [pageLimit])
    /**
    * IW0110
    * This effect call is update isApplyPageLimit variable when sidebarPageLimit available 
    */
    useEffect(() => {
        if (sidebarPageLimit) {
            isApplyPageLimit = sidebarPageLimit
        }
    }, [sidebarPageLimit])
    /**
    * IW0110
    * This effect call on when update final item data list
    */
    useEffect(() => {
        if (dataList?.length) {
            if (searchTerm?.length) setFinalDataList([...dataList])
            else setFinalDataList([...itemList, ...dataList])
        } else {
            if (searchTerm?.length) {
                setFinalDataList([])
            } else {
                const initial_data = itemList?.map(ele => {
                    delete ele['checked']
                    return ele
                })
                if (isApplyData && selectedItemData.length) {
                    const item_data = selectedItemData.map(ele => ele.value)
                    initial_data.map(ele => {
                        if (item_data.includes(ele.value)) {
                            ele.checked = true
                        }
                        return ele
                    })
                    setFinalDataList(initial_data)
                    isApplyData = false
                } else {
                    setFinalDataList(initial_data)
                }
            }
        }
    }, [dataList, itemList])
    /**
     * IW0110
     * This function is call on handle item
     */
    const handleClickItem = (item) => {
        setSelectedItem(item.value)
        const is_available_data = itemList.find(ele => ele.value === item.value)
        if (is_available_data === undefined) {
            toggleSidebar(true, selectedItemtId, item, true)
            setSelectedItem('')
        } else {
            toggleSidebar(true, selectedItemtId, item, false)
            setSelectedItem('')
        }
    }
    /**
     * IW0110
     * This function is call on short-cut key
     */
    const onKeyDown = (_, e) => {
        e.preventDefault()
        if ((e.altKey && e.ctrlKey && e.keyCode === 67) || e.key === 'Escape') {
            toggleSidebar(false, selectedItemtId)
            setSelectedItem('')
            isApplyData = true
        }
    }
    /**
     * IW0110
     * This function is call on reload on data to open pop-up
     */
    useEffect(() => {
        if (selectedItem) {
            window.addEventListener("beforeunload", handlePageRefresh)
        } else {
            window.removeEventListener("beforeunload", handlePageRefresh)
        }
    }, [selectedItem])
    /**
     * IW0110
     * This function is handle checked item
     */
    const handleCheckItem = (item) => {
        const item_data = finalDataList.map(ele => {
            if (ele.value === item.value) {
                if (ele.checked) ele.checked = false
                else ele.checked = true
            }
            return ele
        })
        setFinalDataList(item_data)
        const selected_data = item_data.filter(ele => ele.checked)
        setSelectedItem(selected_data)
    }
    /**
    * IW0110
    * This function is save selected item
    */
    const handleSave = (item) => {
        const item_data = itemList.map(ele => ele.value)
        const new_data = []
        item.forEach(ele => {
            delete ele['checked']
            if (!item_data.includes(ele.value)) {
                new_data.push(ele)
            }
        })
        if (new_data.length) {
            setSelectedItem('')
            toggleSidebar(true, selectedItemtId, item, true, new_data)
        } else {
            setSelectedItem('')
            toggleSidebar(true, selectedItemtId, item, false)
        }
        isApplyData = true
    }

    return (
        <Sidebar
            size='half'
            open={open}
            title={selectedItemValue}
            wrapClassName='munim-sidebar'
            contentClassName='pt-0'
            toggleSidebar={() => { toggleSidebar(false, selectedItemtId); setSelectedItem(''); isApplyData = true }}
        >
            <Hotkeys keyName="ctrl+alt+s,ctrl+alt+c,enter,escape" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
            <div className='munim-search-input-bar'>
                <div className='position-relative munim-search-input-pd'>
                    <Input
                        name='search_variant'
                        placeholder='Search item name'
                        autoComplete="off"
                        type="search"
                        value={searchTerm}
                        onChange={e => handleFilter(e.target.value)}
                    />
                </div>
            </div>
            <CardBody className='p-1 roadmap-feature-body' id='scrolling_item' onScroll={itemScrollerEvent}>
                <ul className='munim-side-full-list'>
                    {finalDataList.length ? finalDataList?.map((item, index) => {
                        return (
                            <>
                                <li key={`item_list_${index}`} onClick={!multipleSelect ? () => handleClickItem(item) : () => { }} className='cursor-pointer'>
                                    <div className='munim-side-full-content'>
                                        {multipleSelect ? <InputCheckBoxField
                                            name={`check_item_${index}`}
                                            className='d-flex'
                                            checked={item.checked}
                                            onChange={() => handleCheckItem(item)}
                                            label={item.label}
                                            image={item.image}
                                            isShowImage={true}
                                        /> : <>
                                            {Object.keys(item).includes('image') ? item.image ? <img src={name === 'channel_product_item' ? `${bucketPathUrl}assets/images/items/${item.image}` : item.image} width='20px' height='20px' className='import-sales-icon' /> : getIcon('EmptyImage') : ''}
                                            <p>{item.label}</p>
                                        </>}
                                    </div>
                                </li>
                                <hr />
                            </>
                        )
                    }) : <div className='munim-save d-flex justify-content-center align-items-center'>There are no records to display.</div>}
                    {isLoading ? <div className='m-auto p-1 d-flex justify-content-center align-items-center'><Spinner size='lg' /></div> : ''}
                </ul>
            </CardBody>
            {multipleSelect ? <div className='munim-sidebar-footer'>
                <div className='d-flex justify-content-end munim-save'>
                    {/* <CustomButton className='me-1' outline color='secondary' type='button' handleClick={() => { toggleSidebar(false, selectedItemtId); setSelectedItem('') }} label='Cancel' tabIndex="-1" /> */}
                    <CustomButton className='me-1' color='primary' type='button' label='Save' disabled={!selectedItem.length} handleClick={() => handleSave(selectedItem)} />
                </div>
            </div> : ''}
        </Sidebar>
    )
}

export default SearchItemSidebar
