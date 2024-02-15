import React, { Fragment, useEffect, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, Button } from 'reactstrap'
import ModuleTitle from '../../common_components/ModuleTitle'
import CommonRouter from '../../helper/commonRoute'
import Hotkeys from 'react-hot-keys'
import OrdersList from './ordersList'
import ApproveOrdersList from './ApproveOrderList'
import DispatchOrdersList from './DispatchOrderList'
import CancelOrdersList from './CancelOrderList'
import ReturnOrdersList from './ReturnOrderList'
import { ApiCall, GetApiCall } from '../../helper/axios'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { useSelector } from 'react-redux'
import PackedOrdersList from './PackedOrderList'
import ShippedOrdersList from './ShippedOrderList'
import DeliverOrdersList from './DeliverOrderList'
import useNotify from '../../custom_hooks/useNotify'
import ReturnRequestOrdersList from './ReturnRequestOrderList'
import moment from 'moment'
import DeleteModal from '../../common_components/pop_up_modal/DeleteModal'
import CustomModal from '../../common_components/pop_up_modal/CustomModel'
import { channel_logo, handlePageRefresh } from '../../helper/commonFunction'

const Orders = () => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const notify = useNotify()
    const [activeTabId, setActiveTabId] = useState('1')
    const [resetModuleData, setResetModuleData] = useState('')
    const [channelData, setChannelData] = useState([])
    const [selectedChannelType, setSelectedChannelType] = useState('')
    const [rowSelection, setRowSelection] = useState({})
    const [dataList, setDataList] = useState([])
    const [isUpdateOrder, setIsUpdateOrder] = useState(false)
    const [deletePopUpActive, setDeletePopUpActive] = useState(false)
    const [saveLoader, setSaveLoader] = useState(false)
    const [customPopUpActive, setCustomPopUpActive] = useState(false)
    const [otcCode, setOtcCode] = useState('')
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
            setSelectedChannelType(item_data[0]?.value)
        } else {
            setChannelData([])
        }
    }
    useEffect(() => {
        if (selected_company_object.id) {
            getConnectedChannel()
        }
    }, [selected_company_object.id])
    const toggle = tab => {
        if (activeTabId !== tab) {
            setActiveTabId(tab)
            setDataList([])
            setRowSelection({})
        }
    }
    const tabRender = () => {
        return (
            <>
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
                                Approved
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '3'}
                                onClick={() => {
                                    toggle('3')
                                }}
                            >
                                Packed
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '4'}
                                onClick={() => {
                                    toggle('4')
                                }}
                            >
                                Ready To Dispatch
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '5'}
                                onClick={() => {
                                    toggle('5')
                                }}
                            >
                                Shipped
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '6'}
                                onClick={() => {
                                    toggle('6')
                                }}
                            >
                                Delivered
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '9'}
                                onClick={() => {
                                    toggle('9')
                                }}
                            >
                                Return Requested
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '7'}
                                onClick={() => {
                                    toggle('7')
                                }}
                            >
                                Return
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={activeTabId === '8'}
                                onClick={() => {
                                    toggle('8')
                                }}
                            >
                                Cancelled
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>
            </>
        )
    }
    const ordersNameSet = () => {
        return (<>
            <CardTitle tag='h4' className='mt-1'>
                {`${activeTabId === '1' ? 'All' : activeTabId === '2' ? 'Approved' : activeTabId === '3' ? 'Packed' : activeTabId === '4' ? 'Ready To Dispatch' : activeTabId === '5' ? 'Shipped' : activeTabId === '6' ? 'Delivered' : activeTabId === '9' ? 'Return Requested' : activeTabId === '7' ? 'Return' : activeTabId === '8' ? 'Cancelled' : ''}`}
            </CardTitle>
        </>
        )
    }
    /**
     * IW0110
     * This function is called when user get order sync
     */
    const orderSync = async (channel_type = '') => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.order_sync}?id=${selected_company_object.id}&channel_type=${channel_type}`, header)
        if (res.data.status === 'success') {
            setIsUpdateOrder(!isUpdateOrder)
            setRowSelection({})
            notify(res.data.message, 'success')
        } else {
            notify(res.data.message, 'error')
        }
    }
    /**
     * IW0110
     * This function is called when user geneate order label
     */
    const generateLabel = async (channel_type = '', rowSelection = {}) => {
        const channel_name = channelData.find(ele => ele.value === channel_type)
        const orders = []
        Object.keys(rowSelection).filter(ele => {
            dataList.map(sub_ele => {
                if (Number(ele) === sub_ele.id) orders.push({ order_id: sub_ele.order_id, order_qty: sub_ele.order_qty })
            })
        })
        const data = {
            id: selected_company_object.id,
            channel_type,
            orders
        }
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await ApiCall('POST', `${CommonApiEndPoint.generate_lable}`, data, header, '', false, 'blob')
        if (res.data) {
            const pdfData = res.data
            const pdfBlob = new Blob([pdfData], { type: 'application/pdf' })
            const pdfUrl = URL.createObjectURL(pdfBlob)
            const link = document.createElement('a')
            link.href = pdfUrl
            link.download = `${channel_name?.label}_label_${moment(new Date()).format("DD/MM/YYYY")}.pdf`
            document.body.appendChild(link)
            link.click()
            setIsUpdateOrder(!isUpdateOrder)
            setRowSelection({})
            notify(res.data.message, 'success')
        } else {
            notify(res.data.message, 'error')
        }
    }
    /**
     * IW0110
     * This function is called when user cancel order 
     */
    const cancelOrder = async (channel_type = '', rowSelection = {}) => {
        setSaveLoader(true)
        const orders = []
        Object.keys(rowSelection).filter(ele => {
            dataList.map(sub_ele => {
                if (Number(ele) === sub_ele.id) orders.push({ order_id: sub_ele.order_id })
            })
        })
        const data = {
            id: selected_company_object.id,
            channel_type,
            orders
        }
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await ApiCall('POST', `${CommonApiEndPoint.cancel_order}`, data, header)
        if (res.data.status === 'success') {
            setIsUpdateOrder(!isUpdateOrder)
            setRowSelection({})
            setSaveLoader(false)
            setDeletePopUpActive(!deletePopUpActive)
            notify(res.data.message, 'success')
        } else {
            setSaveLoader(false)
            notify(res.data.message, 'error')
        }
    }
    const handleCancelOrderPopup = (flag) => {
        if (flag) {
            cancelOrder(selectedChannelType, rowSelection)
        } else {
            setDeletePopUpActive(!deletePopUpActive)
        }
    }
    /**
     * IW0110
     * This function is called when user dispatch order 
     */
    const orderDispatch = async (channel_type = '', rowSelection = {}) => {
        const orders = []
        Object.keys(rowSelection).filter(ele => {
            dataList.map(sub_ele => {
                if (Number(ele) === sub_ele.id) orders.push({ order_id: sub_ele.order_id, order_qty: sub_ele.order_qty })
            })
        })
        const data = {
            id: selected_company_object.id,
            channel_type,
            orders
        }
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await ApiCall('POST', `${CommonApiEndPoint.order_dispatch}`, data, header)
        if (res.data.status === 'success') {
            setIsUpdateOrder(!isUpdateOrder)
            setRowSelection({})
            notify(res.data.message, 'success')
        } else {
            notify(res.data.message, 'error')
        }
    }
    /**
     * IW0110
     * This function is called when user download manifest
     */
    const generateManifest = async (channel_type = '') => {
        const channel_name = channelData.find(ele => ele.value === channel_type)
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.generate_manifest}?id=${selected_company_object.id}&channel_type=${channel_type}`, header, false, false, 'blob')
        if (res.data) {
            const pdfData = res.data
            const pdfBlob = new Blob([pdfData], { type: 'application/pdf' })
            const pdfUrl = URL.createObjectURL(pdfBlob)
            const link = document.createElement('a')
            link.href = pdfUrl
            link.download = `${channel_name?.label}_label_${moment(new Date()).format("DD/MM/YYYY")}.pdf`
            document.body.appendChild(link)
            link.click()
            setIsUpdateOrder(!isUpdateOrder)
            setRowSelection({})
            notify(res.data.message, 'success')
        } else {
            notify(res.data.message, 'error')
        }
    }
    /**
     * IW0110
     * This function is called when user check order status sync 
     */
    const orderStatusSync = async (channel_type = '', rowSelection = {}) => {
        const orders = []
        Object.keys(rowSelection).filter(ele => {
            dataList.map(sub_ele => {
                if (Number(ele) === sub_ele.id) orders.push({ order_id: sub_ele.order_id })
            })
        })
        const data = {
            id: selected_company_object.id,
            channel_type,
            orders
        }
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await ApiCall('POST', `${CommonApiEndPoint.order_status_sync}`, data, header)
        if (res.data.status === 'success') {
            setIsUpdateOrder(!isUpdateOrder)
            setRowSelection({})
            notify(res.data.message, 'success')
        } else {
            notify(res.data.message, 'error')
        }
    }
    /**
     * IW0110
     * This function is called when user geneate label reprint
     */
    const labelReprint = async (channel_type = '', rowSelection = {}) => {
        const channel_name = channelData.find(ele => ele.value === channel_type)
        const orders = []
        Object.keys(rowSelection).filter(ele => {
            dataList.map(sub_ele => {
                if (Number(ele) === sub_ele.id) orders.push({ order_id: sub_ele.order_id, order_qty: sub_ele.order_qty })
            })
        })
        const data = {
            id: selected_company_object.id,
            channel_type,
            orders
        }
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await ApiCall('POST', `${CommonApiEndPoint.lable_reprint}`, data, header, '', false, 'blob')
        if (res.data) {
            const pdfData = res.data
            const pdfBlob = new Blob([pdfData], { type: 'application/pdf' })
            const pdfUrl = URL.createObjectURL(pdfBlob)
            const link = document.createElement('a')
            link.href = pdfUrl
            link.download = `${channel_name?.label}_label_${moment(new Date()).format("DD/MM/YYYY")}.pdf`
            document.body.appendChild(link)
            link.click()
            setIsUpdateOrder(!isUpdateOrder)
            setRowSelection({})
            notify(res.data.message, 'success')
        } else {
            notify(res.data.message, 'error')
        }
    }
    /**
     * IW0110
     * This function is called when user request otc
    */
    const handleCustomePopup = (flag) => {
        if (flag) {
            setIsUpdateOrder(!isUpdateOrder)
            setRowSelection({})
            setCustomPopUpActive(!customPopUpActive)
        } else {
            setCustomPopUpActive(!customPopUpActive)
        }
    }
    const requestOtc = async (channel_type = '') => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.request_otc}?id=${selected_company_object.id}&channel_type=${channel_type}`, header)
        if (res.data.status === 'success') {
            setOtcCode(res.data.data?.otc)
            handleCustomePopup()
            // notify(res.data.message, 'success')
        } else {
            notify(res.data.message, 'error')
        }
    }
    /**
     * IW0110
     * This function is call on reload on data to open pop-up
     */
    useEffect(() => {
        if (Object.keys(rowSelection)?.length) {
            window.addEventListener("beforeunload", handlePageRefresh)
        } else {
            window.removeEventListener("beforeunload", handlePageRefresh)
        }
    }, [rowSelection])
    
    return (
        <>
            <Hotkeys keyName="alt+n" filter={() => true}></Hotkeys>
            <div className='d-flex justify-content-between gap-1 align-items-center munim-list-company munim-company-mob-list'>
                <div className='munim-width-100-mobile'>
                    <ModuleTitle
                        breadCrumbTitle='Orders'
                        url={CommonRouter.orders}
                    />
                </div>
                <div className='d-flex align-items-center gap-2 mobile-device-none'>
                    {activeTabId === '1' ? <>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => orderSync(selectedChannelType)} disabled={!selectedChannelType} >
                            Order Sync
                        </Button>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => orderStatusSync(selectedChannelType, rowSelection)} disabled={!Object.keys(rowSelection).length} >
                            Sync Status
                        </Button>
                    </> : activeTabId === '2' ? <>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => generateLabel(selectedChannelType, rowSelection)} disabled={!Object.keys(rowSelection).length} >
                            Generate Label
                        </Button>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={(e) => { e.preventDefault(); handleCancelOrderPopup() }} disabled={!Object.keys(rowSelection).length} >
                            Cancel Order
                        </Button>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => orderSync(selectedChannelType)} disabled={!selectedChannelType} >
                            Order Sync
                        </Button>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => orderStatusSync(selectedChannelType, rowSelection)} disabled={!Object.keys(rowSelection).length} >
                            Sync Status
                        </Button>
                    </> : activeTabId === '3' ? <>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => orderDispatch(selectedChannelType, rowSelection)} disabled={!Object.keys(rowSelection).length} >
                            Marks As RTD
                        </Button>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => labelReprint(selectedChannelType, rowSelection)} disabled={!Object.keys(rowSelection).length} >
                            Label Reprint
                        </Button>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => orderStatusSync(selectedChannelType, rowSelection)} disabled={!Object.keys(rowSelection).length} >
                            Sync Status
                        </Button>
                    </> : activeTabId === '4' ? <>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => generateManifest(selectedChannelType)} disabled={!selectedChannelType}  >
                            Download Manifest
                        </Button>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => requestOtc(selectedChannelType)} disabled={!selectedChannelType}  >
                            Request OTC
                        </Button>
                        <Button className='add-new-user mobile-d-none' color='primary' onClick={() => orderStatusSync(selectedChannelType, rowSelection)} disabled={!Object.keys(rowSelection).length} >
                            Sync Status
                        </Button>
                    </> : activeTabId === '5' ? <Button className='add-new-user mobile-d-none' color='primary' onClick={() => orderStatusSync(selectedChannelType, rowSelection)} disabled={!Object.keys(rowSelection).length} >
                        Sync Status
                    </Button> : ''}
                </div>
            </div >
            <Fragment>
                <Card className='mt-1 mb-0 munim-card-border munim-loader-add munim-order-table'>
                    {activeTabId ? <TabContent activeTab={activeTabId}>
                        {activeTabId === '1' ? <TabPane tabId='1'>
                            <OrdersList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='1'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={ordersNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                                setDataList={setDataList}
                                dataList={dataList}
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                                isUpdateOrder={isUpdateOrder}
                            />
                        </TabPane> : ''}
                        {activeTabId === '2' ? <TabPane tabId='2'>
                            <ApproveOrdersList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='2'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={ordersNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                                setDataList={setDataList}
                                dataList={dataList}
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                                isUpdateOrder={isUpdateOrder}
                            />
                        </TabPane> : ''}
                        {activeTabId === '3' ? <TabPane tabId='3'>
                            <PackedOrdersList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='3'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={ordersNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                                setDataList={setDataList}
                                dataList={dataList}
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                                isUpdateOrder={isUpdateOrder}
                            />
                        </TabPane> : ''}
                        {activeTabId === '4' ? <TabPane tabId='4'>
                            <DispatchOrdersList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='4'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={ordersNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                                setDataList={setDataList}
                                dataList={dataList}
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                                isUpdateOrder={isUpdateOrder}
                            />
                        </TabPane> : ''}
                        {activeTabId === '5' ? <TabPane tabId='5'>
                            <ShippedOrdersList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='5'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={ordersNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                                setDataList={setDataList}
                                dataList={dataList}
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                                isUpdateOrder={isUpdateOrder}
                            />
                        </TabPane> : ''}
                        {activeTabId === '6' ? <TabPane tabId='6'>
                            <DeliverOrdersList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='6'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={ordersNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                                setDataList={setDataList}
                                dataList={dataList}
                            />
                        </TabPane> : ''}
                        {activeTabId === '7' ? <TabPane tabId='7'>
                            <ReturnOrdersList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='7'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={ordersNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                                setDataList={setDataList}
                                dataList={dataList}
                            />
                        </TabPane> : ''}
                        {activeTabId === '8' ? <TabPane tabId='8'>
                            <CancelOrdersList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='8'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={ordersNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                                setDataList={setDataList}
                                dataList={dataList}
                            />
                        </TabPane> : ''}
                        {activeTabId === '9' ? <TabPane tabId='9'>
                            <ReturnRequestOrdersList
                                tabRender={tabRender}
                                activeTabId={activeTabId}
                                tabId='9'
                                setResetModuleData={setResetModuleData}
                                resetModuleData={resetModuleData}
                                fullScreenTitleShow={true}
                                tabShow={ordersNameSet}
                                itemOption={channelData}
                                selectedItem={selectedChannelType}
                                setSelectedItem={setSelectedChannelType}
                                setDataList={setDataList}
                                dataList={dataList}
                            />
                        </TabPane> : ''}
                    </TabContent> : ''}
                </Card>
            </Fragment>
            <DeleteModal
                deletePopUpActive={deletePopUpActive}
                popUpTitle='Cancel Order'
                loader={saveLoader}
                secondaryLabel='Not now'
                primaryLabel='Cancel'
                popUpContent='Are you sure, you want to cancel this order.'
                handleDeletePopUp={handleCancelOrderPopup}
            />
            <CustomModal
                customPopUpActive={customPopUpActive}
                popUpTitle='One Time Code (OTC)'
                secondaryLabel='Cancel'
                primaryLabel='Okay'
                popUpContent={`<p>If you are satisfied with pickup then share forward OTC - <b>${otcCode}</b> with the Flipkart agent for Ekart Non-Large.</p>`}
                handleCustomPopUp={handleCustomePopup}
            />
        </>
    )
}
export default Orders
