import React, { Fragment, useEffect, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle } from 'reactstrap'
import ModuleTitle from '../../../common_components/ModuleTitle'
import CommonRouter from '../../../helper/commonRoute'
import Hotkeys from 'react-hot-keys'
import CustomButton from '../../../common_components/custom_field/CustomButton'
import { useSelector } from 'react-redux'
import { ApiCall, GetApiCall } from '../../../helper/axios'
import CommonApiEndPoint from '../../../helper/commonApiEndPoint'
import useNotify from '../../../custom_hooks/useNotify'
import ChannelProductList from './ChannelProductList'
import { channel_logo } from '../../../helper/commonFunction'

const ChannelProductMapping = () => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const notify = useNotify()
    const [activeTabId, setActiveTabId] = useState('1')
    const [resetModuleData, setResetModuleData] = useState('')
    const [channelData, setChannelData] = useState([])
    const [selectedMasterItemData, setSelectedMasterItemData] = useState('')
    const toggle = tab => {
        if (activeTabId !== tab) {
            setActiveTabId(tab)
        }
    }
    const tabRender = () => {
        return (
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
                </Nav>
            </div>
        )
    }
    const productNameSet = () => {
        return (
            <CardTitle tag='h4' className='mt-1'>
                {`${activeTabId === '1' ? 'All' : ''}`}
            </CardTitle>
        )
    }
    /**
     * IW0214
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
     * IW0214
     * This function is apply sku on channel product item
     */
    const onHeandelSubmit = async (map_items) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const data = { map_items }
        const res = await ApiCall('POST', CommonApiEndPoint.map_channel_items, data, header)
        if (res.data.status === 'success') {
            notify(res.data.message, 'success')
            setResetModuleData('1')
        } else {
            notify(res.data.message, 'error')
        }
    }

    return (
        <>
            <Hotkeys keyName="alt+n" filter={() => true}></Hotkeys>
            <div className='d-flex justify-content-between gap-1 align-items-center'>
                <div className='munim-width-100-mobile'>
                    <ModuleTitle
                        links={[CommonRouter.channels]}
                        breadCrumbTitle='Channel product mapping'
                    />
                </div>
                <div>
                    <CustomButton
                        type='button'
                        color='primary'
                        label='Save'
                        disabled={!selectedMasterItemData.length}
                        handleClick={() => onHeandelSubmit(selectedMasterItemData)}
                    />
                </div>
            </div >
            <Fragment>
                <Card className='mt-1 mb-0 munim-card-border'>
                    {activeTabId ? <TabContent activeTab={activeTabId}>
                        {activeTabId === '1' ? <TabPane tabId='1'>
                            <ChannelProductList
                                tabId='1'
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                fullScreenTitleShow={true}
                                itemOption={channelData}
                                tabShow={productNameSet}
                                resetModuleData={resetModuleData}
                                setResetModuleData={setResetModuleData}
                                selectedMasterItemData={selectedMasterItemData}
                                setSelectedMasterItemData={setSelectedMasterItemData}
                            />
                        </TabPane> : ''}
                    </TabContent> : ''}
                </Card>
            </Fragment>
        </>
    )
}
export default ChannelProductMapping
