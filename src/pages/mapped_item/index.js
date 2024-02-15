import React, { Fragment, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Card, CardTitle } from 'reactstrap'
import ModuleTitle from '../../common_components/ModuleTitle'
import { useHistory } from 'react-router'
import ChannelItemList from './MappedItemList'
import CommonRouter from '../../helper/commonRoute'
import { demouser } from '../../helper/commonApi'
import Hotkeys from 'react-hot-keys'

const ChannelMappedItem = () => {
    const history = useHistory()
    const location_state = history.location.state
    const [activeTabId, setActiveTabId] = useState(location_state === null || location_state === undefined ? '1' : location_state.tab)
    const [resetModuleData, setResetModuleData] = useState('')
    const [customFilterList, setCustomFilterList] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const toggle = tab => {
        if (activeTabId !== tab) {
            setActiveTabId(tab)
            history.push(CommonRouter.mapped_item, { tab })
        }
    }
    const getCustomFilterList = async () => {
    }
    const handleDeleteFilter = (name) => {
        const final_filter_list = customFilterList.filter((item) => item.filter_name !== name)
        setCustomFilterList(final_filter_list)

    }

    const openModule = () => {
        history.push(CommonRouter.master_import_data, { edit: true })
    }
    const handleFilter = (e) => {
        setSearchTerm(e)
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
    const onKeyDown = (keyName, e) => {
        e.preventDefault()
        if (keyName === 'alt+n') {
            history.push()
        }
    }
    return (
        <>
            <Hotkeys keyName="alt+n" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
            <div className='d-flex justify-content-between gap-1 align-items-center munim-list-company munim-company-mob-list'>
                <div>
                    <ModuleTitle
                        breadCrumbTitle={"Mapped Item"}
                        url={CommonRouter.channel_items}
                        customFilterList={customFilterList}
                        handleDeleteFilter={handleDeleteFilter}
                    /></div>
                <div className='d-flex align-items-center gap-2'>
                    <>
                        <div className='create-mobil-btn-show desktop-device-none'>
                            <div className='mobil-creat-svg-border'>
                                <svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" cursor='pointer' className='' onClick={(e) => { e.preventDefault(); openModule() }}>
                                    <path d="M10.8756 6.56H6.50763V10.856H4.49163V6.56H0.123625V4.664H4.49163V0.344H6.50763V4.664H10.8756V6.56Z" fill="#fff" />
                                </svg>
                            </div>
                        </div>
                        <Button className='add-new-user mobile-device-none' color='primary' onClick={openModule} disabled={demouser}>
                            Import Item
                        </Button> </>
                </div>
            </div >
            <Fragment>
                <Card className='mt-1 mb-0 munim-card-border munim-loader-add'>
                    {activeTabId ? <TabContent activeTab={activeTabId}>
                        {activeTabId === '1' ? <TabPane tabId='1'>
                            <ChannelItemList
                                tabRender={tabRender}
                                searchTerm={searchTerm}
                                handleSearchTerm={handleFilter}
                                activeTabId={activeTabId}
                                tabId='1'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                getCustomFilterList={getCustomFilterList}
                                fullScreenTitleShow={true}
                                tabShow={companyNameSet}
                            />
                        </TabPane> : ''}
                        {activeTabId === '2' ? <TabPane tabId='2'>
                            <ChannelItemList
                                tabRender={tabRender}
                                searchTerm={searchTerm}
                                handleSearchTerm={handleFilter}
                                activeTabId={activeTabId}
                                tabId='1'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                getCustomFilterList={getCustomFilterList}
                                fullScreenTitleShow={true}
                                tabShow={companyNameSet}
                            />
                        </TabPane> : ''}
                        {activeTabId === '3' ? <TabPane tabId='3'>
                            <ChannelItemList
                                tabRender={tabRender}
                                searchTerm={searchTerm}
                                handleSearchTerm={handleFilter}
                                activeTabId={activeTabId}
                                tabId='1'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                getCustomFilterList={getCustomFilterList}
                                fullScreenTitleShow={true}
                                tabShow={companyNameSet}
                            />
                        </TabPane> : ''}
                    </TabContent> : ''}
                </Card>
            </Fragment>
        </>
    )
}
export default ChannelMappedItem
