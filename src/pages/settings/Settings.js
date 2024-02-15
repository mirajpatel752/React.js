import React from 'react'
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import ModuleTitle from "../../common_components/ModuleTitle"
import CommonRouter from "../../helper/commonRoute"
import Avatar from '@components/avatar'
import * as Icon from 'react-feather'
import { useHistory } from 'react-router-dom'
import { DefaultRoute } from '../../router/routes'
import { useSelector } from 'react-redux'


function Settings() {
    const history = useHistory()
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    return (
        <>
            <Row className='justify-content-center'>
                <Col lg='8' sm='12'>
                    <div className="munim-list-company d-flex justify-content-between align-items-center flex-nowrap"><ModuleTitle breadCrumbTitle='Setting' links={['']} active={'1'} section={2} module={'3'} url={DefaultRoute} status={{ color: 'light-success', status: 'Received' }} /></div>
                    <Card className='card-transaction mt-1 munim-card-border mb-0'>
                        <CardBody>
                            <Row className='transaction-item munim-setting-bg-color'>
                                <Col sm='12' lg='6'>
                                    <Button outline className='w-100 munim-border-bottom-unset px-0 text-start p-0' onClick={e => { e.preventDefault(); history.push(CommonRouter.company_edit, { company_id: selected_company_object.id, back: true }) }}>
                                        <div className='d-flex align-items-start munim-setting-tab-hover p-1'>
                                            <Avatar className='rounded' icon={<Icon.Settings size={18} />} />
                                            <div>
                                                <div className='d-flex'>
                                                    <h6 className='transaction-title'>Company</h6>
                                                </div>
                                                <small>View and update your store details</small>
                                            </div>
                                        </div>
                                    </Button>
                                </Col>
                                <Col sm='12' lg='6'>
                                    <Button outline className='w-100 munim-border-bottom-unset px-0 text-start p-0' onClick={e => { e.preventDefault(); history.push(CommonRouter.profile) }}>
                                        <div className='d-flex align-items-start munim-setting-tab-hover p-1'>
                                            <Avatar className='rounded' icon={<Icon.User size={18} />} />
                                            <div>
                                                <div className='d-flex'>
                                                    <h6 className='transaction-title'>User Account</h6>
                                                </div>
                                                <small>View your Update Profile</small>
                                            </div>
                                        </div>
                                    </Button>
                                </Col>

                                <Col sm='12' lg='6'>
                                    <Button outline className='w-100 munim-border-bottom-unset px-0 text-start p-0' onClick={(e) => { e.preventDefault(); history.push({ pathname: CommonRouter.menu_import_file_log }) }} >
                                        <div className='d-flex align-items-start munim-setting-tab-hover p-1'>
                                            <Avatar className='rounded' icon={
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#919eab" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-database"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>} />
                                            <div>
                                                <div className='d-flex'>
                                                    <h6 className='transaction-title'>Import Logs</h6>
                                                </div>
                                                <small>View your imported data from this option</small>
                                            </div>
                                        </div>
                                    </Button>
                                </Col>
                                <Col sm='12' lg='6'>
                                    <Button outline className='w-100 munim-border-bottom-unset px-0 text-start p-0' onClick={e => { e.preventDefault(); history.push({ pathname: CommonRouter.user_activity_setting }) }}>
                                        <div className='d-flex align-items-start munim-setting-tab-hover p-1'>
                                            <Avatar className='rounded' icon={<Icon.Users size={18} />} />
                                            <div>
                                                <div className='d-flex'>
                                                    <h6 className='transaction-title'>User Activity</h6>
                                                </div>
                                                <small>View your activity from this option</small>
                                            </div>
                                        </div>
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col >
            </Row >
        </>
    )
}
export default Settings