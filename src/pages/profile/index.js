/* eslint-disable no-unneeded-ternary */
import React, { Fragment, useState, useEffect } from 'react'
import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Card } from 'reactstrap'
import { User, Lock } from 'react-feather'
import ModuleTitle from '../../common_components/ModuleTitle'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import { useHistory } from 'react-router-dom'
import CommonRouter from '../../helper/commonRoute'
import { setUserName } from '../../redux/commonSlice'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { GetApiCall } from '../../helper/axios'
import { useDispatch } from 'react-redux'
import { munimApiEndpoint } from '../../helper/commonApi'
import Security from './Security'
import Account from './Account'
const AccountSettings = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const location_state = history.location.state
    const [activeTab, setActiveTab] = useState('1')
    // const user_name = useSelector((state) => state.commonReducer.user_name)
    const [changeEmailAddress, setChangeEmailAddress] = useState()
    const [formState, setFormState] = useState({
        fname: '',
        lname: '',
        email: '',
        mobile: '',
        mobile_otp: '',
        email_otp: ''
    })
    const [passState, setPassState] = useState({
        mobile: '',
        otp: '',
        old_password: '',
        new_password: '',
        confirm_password: ''
    })
    const toggleTab = tab => {
        if (tab !== activeTab) {
            history.push({ pathname: CommonRouter.user_account, state: { tab } })
        }
    }

    const fetchData = async () => {
        const header = {
            'access-token': localStorage.getItem('access_token')
        }
        try {
            const res = await GetApiCall('GET', `${munimApiEndpoint}${CommonApiEndPoint.get_profile}`, header, false, true)
            if (res.data.status === 'success') {
                setPassState({ ...passState, mobile: res.data.data.mobile })
                setFormState(res.data.data)
                dispatch(setUserName(res.data.data))
                if (res.data.data.email.length === 0) {
                    setChangeEmailAddress(true)
                } else {
                    setChangeEmailAddress(false)
                }
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    /**
     * IW0079
     * This effect call on set active tab
     */
    useEffect(() => {
        if (location_state) {
            setActiveTab(location_state?.tab)
        }
    }, [location_state])
    return (
        <Fragment>
            <Row className='justify-content-center'>
                <Col sm={12} lg={8} >
                    <div className="munim-list-company"><ModuleTitle breadCrumbTitle='User Account' links={[CommonRouter.setting]} /></div>
                    <>
                        <Card className='mt-1 mb-0 munim-card-border'>
                            <Nav tabs className='mb-0 munim-border-bottom munim-general-setting'>
                                <NavItem>
                                    <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
                                        <User size={18} className='me-50' />
                                        <span className='fw-bold'>Account</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
                                        <Lock size={18} className='me-50' />
                                        <span className='fw-bold'>Security</span>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            {activeTab ? <TabContent activeTab={activeTab}>
                                <TabPane tabId='1'>
                                    <Account
                                        activeTab={activeTab}
                                        formState={formState}
                                        setFormState={setFormState}
                                        changeEmailAddress={changeEmailAddress}
                                        setChangeEmailAddress={setChangeEmailAddress}
                                    />
                                </TabPane>
                                <TabPane tabId='2'>
                                    <Security
                                        activeTab={activeTab}
                                        passState={passState}
                                    />
                                </TabPane>
                            </TabContent> : ''}
                        </Card>
                    </>
                </Col>
            </Row>
        </Fragment>
    )
}

export default AccountSettings
