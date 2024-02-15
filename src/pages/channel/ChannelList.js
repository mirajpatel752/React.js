/* eslint-disable prefer-const */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-duplicate-imports */
/* eslint-disable multiline-ternary */
import React from 'react'
import { Button, Card, CardBody, Col, Row, Spinner } from 'reactstrap'
import ModuleTitle from '../../common_components/ModuleTitle'
import CommonRouter from '../../helper/commonRoute'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { useEffect, useState } from 'react'
import { GetApiCall } from '../../helper/axios'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { bucketUrl } from '../../helper/commonApi'

const ChannelList = () => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const [channelListData, setChannelListData] = useState([])
    const [channelActive, setChannelActive] = useState({})
    const history = useHistory()
    const getChannelList = async () => {
        const header = {
            'access-token': localStorage.getItem('access_token')
        }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.channel_list}?id=${selected_company_object.id}`, header)
        if (res.data.status === 'success') {
            const data = res.data.data
            setChannelListData(data)
        } else {
            setChannelListData([])
        }
    }

    useEffect(() => {
        getChannelList()
    }, [])
    return (
        <>
            <Row className='justify-content-center'>
                <Col lg='8' sm='12'>
                    <div className="munim-list-company">
                        <ModuleTitle breadCrumbTitle='Channels for Business' links={[CommonRouter.channels]} />
                    </div>
                    <Card className='my-1 munim-card-border'>
                        <CardBody className='pt-5'>
                            <div className='munim-channel-cards munim-channel-all gap-1'>
                                {
                                    channelListData.length ? <> {
                                        channelListData.map((item) => {
                                            return (
                                                <Card key={item.id} onClick={() => item.status === "1" ? item.is_connected !== 0 ? null : setChannelActive(item) : null} className={`${item.status === "1" ? item.is_connected !== 0 ? "pending-mon-card" : " " : "pending-mon-card"} mb-0 munim-card-border munim-cards-rounded ${channelActive.channel_type === item.channel_type ? "munim-channel-card-active" : ""}`}>
                                                    <CardBody>
                                                        <div className='d-flex align-items-center'>
                                                            <div className='munim-channel-logo'>
                                                                <img className="w-100" src={`${bucketUrl}assets/images/${item.logo}`} alt="Channel logo" />
                                                            </div>
                                                            <div className={`munim-channel-content ms-1`}>
                                                                <h3>{item.channel_name}</h3>
                                                                <p className={`lh-sm ${item.status === "0" ? "pending-mon-name" : item.is_connected === 0 ? "" : item.is_connected === 1 ? "connected-channel" : "pending-mon-name"}`}>{item.status === "1" ? item.is_connected === 1 ? "Connected" : item.is_connected === 2 ? "Not connected" : item.description : "(Coming Soon)"}</p>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            )
                                        })
                                    }</> : <div className='m-auto p-1'><Spinner size='lg' /></div>
                                }

                            </div>
                        </CardBody>
                    </Card>
                    <div className='d-flex justify-content-end'>
                        <Button disabled={!Object.keys(channelActive).length} color='primary' onClick={() => history.push(CommonRouter.channel_connection, { channel_id: channelActive })}>Next</Button>
                    </div>
                </Col>
            </Row >
        </>
    )
}
export default ChannelList