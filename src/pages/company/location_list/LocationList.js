import React, { useEffect, useState } from 'react'
import Sidebar from '@components/sidebar'
import CreateLocation from './CreateLocation'
import { GetApiCall } from '../../../helper/axios'
import { useSelector } from 'react-redux'
import CommonApiEndPoint from '../../../helper/commonApiEndPoint'
import { Button } from 'reactstrap'

const LocationList = ({ toggleSidebar, sidebarOpen }) => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const [locationListData, setLocationListData] = useState([])
    const [listingShow, setListingShow] = useState(0)
    const [locationEditData, setLocationEditData] = useState({})

    async function fetchlocationList() {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_location_list}?id=${selected_company_object.id}`, header)
        if (res.data.status === 'success') {
            setLocationListData(res.data.data)
        } else if (res.data.statusCode === 404) {
            setLocationListData([])
        }
    }
    useEffect(() => {
        if (sidebarOpen) {
            fetchlocationList()
        }
    }, [sidebarOpen, listingShow])

    return (
        <>
            <Sidebar
                size='lg'
                open={sidebarOpen}
                title={`Location ${listingShow === 0 ? "List" : listingShow === 1 ? "Create" : "Edit"}`}
                wrapClassName='munim-sidebar'
                contentClassName='pt-0'
                toggleSidebar={() => { toggleSidebar(false); setListingShow(0) }}
            >
                {
                    listingShow === 0 &&
                    <>
                        <div className='d-flex justify-content-end mb-1' >
                            <Button color='primary' onClick={() => setListingShow(1)} >
                                Add New Location
                            </Button>
                        </div>
                        <div className='munim-location-table mb-1'>
                            <table>
                                <tbody>
                                    {
                                        locationListData && locationListData.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <div className='munim-location-svg'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13.339 13.214c2.128-3.34 1.86-2.923 1.922-3.01a6.397 6.397 0 0 0 1.184-3.72C16.445 2.93 13.56 0 10 0 6.451 0 3.555 2.923 3.555 6.484c0 1.34.418 2.66 1.218 3.768l1.888 2.962c-2.019.31-5.45 1.235-5.45 3.27 0 .742.484 1.8 2.791 2.624C5.613 19.683 7.743 20 10 20c4.22 0 8.79-1.19 8.79-3.516 0-2.035-3.428-2.959-5.451-3.27ZM5.752 9.607a5.258 5.258 0 0 1-1.025-3.123c0-2.93 2.36-5.312 5.273-5.312 2.908 0 5.273 2.383 5.273 5.312a5.231 5.231 0 0 1-.962 3.034c-.057.075.238-.383-4.311 6.755L5.752 9.607ZM10 18.828c-4.61 0-7.617-1.355-7.617-2.344 0-.664 1.545-1.757 4.97-2.183l2.153 3.377a.586.586 0 0 0 .988 0l2.152-3.377c3.425.426 4.971 1.519 4.971 2.183 0 .98-2.98 2.344-7.617 2.344Z" fill="#000" /><path d="M10 3.555a2.933 2.933 0 0 0-2.93 2.93A2.933 2.933 0 0 0 10 9.414a2.933 2.933 0 0 0 2.93-2.93A2.933 2.933 0 0 0 10 3.554Zm0 4.687a1.76 1.76 0 0 1-1.758-1.758 1.759 1.759 0 0 1 3.516 0A1.76 1.76 0 0 1 10 8.242Z" fill="#000" /></svg>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='munim-location-data'>
                                                            <div>
                                                                <h2>{item.address}</h2>
                                                                <p>{item.address}, {item.city}, {item.state} India </p>
                                                            </div>
                                                            <div>

                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <ul className='munim-location-data-option'>
                                                            <li>
                                                                <button>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.759 2.491a.583.583 0 0 0-.825-.002.586.586 0 0 0-.131.207c-.486 1.013-1.02 1.584-1.694 1.921-.757.373-1.625.633-3.025.633a.587.587 0 0 0-.572.697.584.584 0 0 0 .16.299l1.892 1.891-2.647 3.53 3.53-2.647 1.89 1.891a.578.578 0 0 0 .898-.087.581.581 0 0 0 .099-.324c0-1.4.259-2.269.631-3.014.337-.674.908-1.208 1.921-1.694a.573.573 0 0 0 .377-.544.583.583 0 0 0-.172-.412L9.759 2.491Z" fill="#1773EA" /></svg>
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button onClick={() => { setListingShow(2); setLocationEditData(item) }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><g clipPath="url(#a)" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.417 2.333H2.334A1.167 1.167 0 0 0 1.167 3.5v8.167a1.166 1.166 0 0 0 1.167 1.166H10.5a1.167 1.167 0 0 0 1.167-1.166V7.583" /><path d="M10.792 1.458a1.237 1.237 0 0 1 1.75 1.75L7 8.75l-2.333.583L5.25 7l5.542-5.542Z" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h14v14H0z" /></clipPath></defs></svg>
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.75 3.5h10.5m-1.166 0v8.167a1.167 1.167 0 0 1-1.167 1.166H4.084a1.167 1.167 0 0 1-1.167-1.166V3.5m1.75 0V2.333a1.167 1.167 0 0 1 1.167-1.166h2.333a1.167 1.167 0 0 1 1.167 1.166V3.5M5.833 6.417v3.5m2.334-3.5v3.5" stroke="#000" strokeWidth="1.167" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                }
                {
                    listingShow === 1 &&
                    <CreateLocation toggleSidebar={toggleSidebar} setListingShow={setListingShow} locationListData={1} flag={1} />
                }
                {
                    listingShow === 2 &&
                    <CreateLocation toggleSidebar={toggleSidebar} setListingShow={setListingShow} locationListData={locationEditData} flag={2} />
                }

            </Sidebar >
        </>
    )
}

export default LocationList