import React, { Fragment, useEffect, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Card, CardTitle } from 'reactstrap'
import ModuleTitle from '../../common_components/ModuleTitle'
import { useHistory } from 'react-router'
import CompanyList from './CompanyList'
import CommonRouter from '../../helper/commonRoute'
import { demouser } from '../../helper/commonApi'
import Hotkeys from 'react-hot-keys'

const Company = () => {
    const [activeTabId, setActiveTabId] = useState('1')
    const history = useHistory()
    const location_state = history.location.state
    const [resetModuleData, setResetModuleData] = useState('')
    const [customFilterList, setCustomFilterList] = useState([])
    const [showModule, setShowModule] = useState([])
    const [reportFilterValue, setReportFilterValue] = useState('Company')
    const toggle = tab => {
        if (activeTabId !== tab) {
            history.push(CommonRouter.company, { previous_tab: tab })
        }
    }
    const getCustomFilterList = async () => {
    }
    const handleDeleteFilter = (name) => {
        const final_filter_list = customFilterList.filter((item) => item.filter_name !== name)
        setCustomFilterList(final_filter_list)
        if (reportFilterValue === name) {
            history.replace(CommonRouter.company, { customFilterDetail: { filter_name: 'Company' } })
        }
    }
    const handleShownData = (tab) => {
        setShowModule(oldData => {
            if (!oldData.includes(tab)) {
                return [...oldData, tab]
            } else {
                return oldData
            }
        })
        setResetModuleData(tab)
        setActiveTabId(tab)
    }

    const openModule = () => {
        history.push(CommonRouter.company_create, { active_tab: activeTabId, customFilterDetail: location_state?.customFilterDetail ? location_state.customFilterDetail : false })
    }
    useEffect(() => {
        if (location_state) {
            setActiveTabId(location_state)
        }
        if (location_state?.customFilterDetail?.filter_name) {
            const is_available = customFilterList.find((item) => item.filter_name === location_state.customFilterDetail.filter_name)
            if (!is_available) {
                if (customFilterList.length) {
                    setCustomFilterList([...customFilterList, location_state.customFilterDetail])
                } else {
                    setCustomFilterList([{ filter_name: 'Company' }, location_state.customFilterDetail])
                }
            }
            setReportFilterValue(location_state.customFilterDetail.filter_name)
            if (location_state.customFilterDetail?.tab_id) {
                handleShownData(location_state.customFilterDetail.tab_id.toString())
            } else {
                handleShownData('1')
            }
        } else if (location_state?.previous_tab) {
            handleShownData(location_state.previous_tab)
        } else {
            setReportFilterValue('Company')
            handleShownData('1')
        }
    }, [location_state])

    const tabRender = () => {
        return (<>
            {reportFilterValue === 'Company' ? <><Nav tabs className='mb-0 munim-border-bottom'>
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
            </Nav></> : ''
            }
        </>
        )
    }
    const companyNameSet = () => {
        return (<>
            <CardTitle tag='h4' className='mt-1'>
                {reportFilterValue === 'Company' ? `${reportFilterValue}/${activeTabId === '1' ? 'All' : activeTabId === '2' ? 'Own' : activeTabId === '3' ? 'Managed' : activeTabId === '4' ? 'Shared' : ''}` : reportFilterValue}
            </CardTitle>
        </>
        )
    }
    const onKeyDown = (keyName, e) => {
        e.preventDefault()
        if (keyName === 'alt+n') {
            history.push(CommonRouter.company_create, { comp_create: '3' })
        }
    }
    return (
        <>
            <Hotkeys keyName="alt+n" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
            <div className='d-flex justify-content-between gap-1 align-items-center munim-list-company munim-company-mob-list'>
                <div>
                    <ModuleTitle
                        breadCrumbTitle={reportFilterValue}
                        url={CommonRouter.company}
                        customFilterList={customFilterList}
                        handleDeleteFilter={handleDeleteFilter}
                    /></div>
                <div className='d-flex align-items-center gap-2'>
                    <><div className='create-mobil-btn-show desktop-device-none'>
                        <div className='mobil-creat-svg-border' onClick={openModule}>
                            <svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" cursor='pointer' className='' onClick={(e) => { e.preventDefault(); history.push(CommonRouter.company_create) }}>
                                <path d="M10.8756 6.56H6.50763V10.856H4.49163V6.56H0.123625V4.664H4.49163V0.344H6.50763V4.664H10.8756V6.56Z" fill="#fff" />
                            </svg>
                        </div>
                    </div>
                        <Button className='add-new-user mobile-device-none' color='primary' onClick={openModule} disabled={demouser}>
                            Create Company
                        </Button> </>
                </div>
            </div >
            <Fragment>
                <Card className='mt-1 mb-0 munim-card-border'>
                    {activeTabId ? <TabContent activeTab={activeTabId}>
                        {showModule.includes('1') ? <TabPane tabId='1'>
                            <CompanyList
                                module={module}
                                tabRender={tabRender}
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
            <div className="mt-2 mb-2 munim-tble-shortcutkey-main">
                <div className='pe-1'>
                    <span className='text-uppercase fw-bolder munim-shortcut-letter munim-shortcutkey-text-clr'>Shortcuts:</span>
                </div>
                <div className="munim-sales-tble-shortcutkey" >
                    <div>
                        <span>
                            <button className="munim-input-key fw-bold" tabIndex="-1">Alt</button>
                            <span className='ps-0'> + </span>
                            <button className="munim-input-key fw-bold" tabIndex="-1">N</button>
                        </span>
                        <span className='fw-bold munim-shortcutkey-text-clr'>Create Company</span>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Company
