import React, { Fragment, useEffect, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle } from 'reactstrap'
import ModuleTitle from '../../common_components/ModuleTitle'
import { useHistory } from 'react-router'
import ChannelItemList from './ChannelItemList'
import CommonRouter from '../../helper/commonRoute'
import Hotkeys from 'react-hot-keys'
import { GetApiCall } from '../../helper/axios'
import { useSelector } from 'react-redux'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { channel_logo, handlePageRefresh } from '../../helper/commonFunction'

const ChannelItem = () => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const history = useHistory()
    const location_state = history.location.state
    const [activeTabId, setActiveTabId] = useState(location_state === null || location_state === undefined ? '1' : location_state?.tab)
    const [resetModuleData, setResetModuleData] = useState('')
    const [customFilterList, setCustomFilterList] = useState([])
    const [selectedChannelType, setSelectedChannelType] = useState('')
    const [channelData, setChannelData] = useState([])
    const handleDeleteFilter = (name) => {
        const final_filter_list = customFilterList.filter((item) => item.filter_name !== name)
        setCustomFilterList(final_filter_list)
    }
    const toggle = tab => {
        if (activeTabId !== tab) {
            setActiveTabId(tab)
            history.push(CommonRouter.channel_items, { tab })
        }
    }
    const tabRender = () => {
        return (<>
            {<>
                <div className='d-flex justify-content-between w-100'>
                    <Nav tabs className='mb-0 munim-border-bottom'>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '1'}
                                onClick={() => {
                                    toggle('1')
                                }}
                            >
                                All
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '2'}
                                onClick={() => {
                                    toggle('2')
                                }}
                            >
                                Mapped
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '3'}
                                onClick={() => {
                                    toggle('3')
                                }}
                            >
                                Unmapped
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>

            </>
            }
        </>
        )
    }
    const companyNameSet = () => {
        return (<>
            <CardTitle tag='h4' className='mt-1'>
                {`${activeTabId === '1' ? 'All' : activeTabId === "2" ? "Mapped" : activeTabId === "3" ? "Unmapped" : ""}`}
            </CardTitle>
        </>
        )
    }
    /**
     * IW0110
     * This function is get connectted channel list
     */
    const getConnectedChannel = async () => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_connect_channel}?id=${selected_company_object.id}&is_action=1`, header)
        if (res.data.status === 'success') {
            const item_data = []
            res.data.data.row_data.map(item => {
                item_data.push({ label: item.channel_name, value: item.channel_type, logo: channel_logo[item.channel_type] })
            })
            setChannelData(item_data)
        } else {
            setChannelData([])
        }
    }
    useEffect(() => {
        if (selected_company_object.id) {
            getConnectedChannel()
        }
    }, [selected_company_object.id])
    /**
     * IW0110
     * This function is call on reload on data to open pop-up
     */
    useEffect(() => {
        if (selectedChannelType) {
            window.addEventListener("beforeunload", handlePageRefresh)
        } else {
            window.removeEventListener("beforeunload", handlePageRefresh)
        }
    }, [selectedChannelType])

    return (
        <>
            <Hotkeys keyName="alt+n" filter={() => true}></Hotkeys>
            <div className='d-flex justify-content-between gap-1 align-items-center munim-list-company munim-company-mob-list'>
                <div className='munim-width-100-mobile'>
                    <ModuleTitle
                        breadCrumbTitle={"Channel Item"}
                        url={CommonRouter.channel_items}
                        customFilterList={customFilterList}
                        handleDeleteFilter={handleDeleteFilter}
                    /></div>
            </div >
            <Fragment>
                <Card className='mt-1 mb-0 munim-card-border munim-loader-add munim-order-table'>
                    {activeTabId ? <TabContent activeTab={activeTabId}>
                        {activeTabId === '1' ? <TabPane tabId='1'>
                            <ChannelItemList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='1'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={companyNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                            />
                        </TabPane> : ''}
                        {activeTabId === '2' ? <TabPane tabId='2'>
                            <ChannelItemList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='1'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={companyNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                            />
                        </TabPane> : ''}
                        {activeTabId === '3' ? <TabPane tabId='3'>
                            <ChannelItemList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='1'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={companyNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                            />
                        </TabPane> : ''}
                    </TabContent> : ''}
                </Card>
            </Fragment>
        </>
    )
}
export default ChannelItem
