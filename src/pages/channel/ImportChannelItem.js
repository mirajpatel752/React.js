/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Input, Label, Row, Spinner } from 'reactstrap'
import ModuleTitle from '../../common_components/ModuleTitle'
import CommonRouter from '../../helper/commonRoute'
import BasicAlert from '../../common_components/BasicAlert'
import { useHistory } from 'react-router'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { useSelector } from 'react-redux'
import { ApiCall, GetApiCall } from '../../helper/axios'
import ImportLogProgress from '../dashboard/component/ImportLogProgress'
import FixSelect from '../../common_components/search_select/FixSelect'
import useNotify from '../../custom_hooks/useNotify'
import { toast } from 'react-toastify'
import { bucketPathUrl, bucketUrl } from '../../helper/commonApi'
import { channel_logo } from '../../helper/commonFunction'

const ImportChannel = () => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const history = useHistory()
    const notify = useNotify()
    const location_state = history.location.state
    const [dataImportSuccess, setDataImportSuccess] = useState(false)
    const [progressVal, setProgressVal] = useState(0)
    const [totalFileCount, setTotalFileCount] = useState(0)
    const [successFileCount, setSuccessFileCount] = useState(0)
    const [progressShow, setProgressShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [channelOption, setChannelOption] = useState([])
    const [channelType, setChannelType] = useState('')
    const [xlsxdata, setXlsxData] = useState({
        file: "",
        fileName: ""
    })
    useEffect(() => {
        if (location_state?.channel_id?.channel_type) {
            setChannelType(location_state?.channel_id?.channel_type)
        }
    }, [location_state?.channel_id?.channel_type])
    const getImportFileLogListData = async (flag = false) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_import_progress}?id=${selected_company_object.id}`, header)
        if (res.data.status === 'success') {
            setProgressVal(res.data.data.import_progress_per)
            setTotalFileCount(res.data.data.total_file_count)
            setSuccessFileCount(res.data.data.total_import_file)
            if (res.data.data.import_progress_per === 100) {
                if (!flag) {
                    setDataImportSuccess(true)
                }
                setProgressShow(false)
                setProgressVal(1)
                setTotalFileCount(0)
                setSuccessFileCount(0)
                setXlsxData({ file: "", fileName: "" })
                notify(res.data.message, 'success')
            }
            if (res.data.data.import_progress_per !== 100 && history.location.pathname.includes("import-channel-item")) {
                setProgressShow(true)
                setTimeout(() => {
                    getImportFileLogListData()
                }, 2000)

            }
        } else {
            setProgressShow(false)
        }
    }
    const handleImportFile = async () => {
        try {
            const channel_data = channelOption.find(ele => ele.value === channelType)
            setLoading(true)
            const data = {
                id: selected_company_object.id,
                channel_type: channel_data ? channel_data?.channel_type : location_state?.channel_id?.channel_type,
                file: xlsxdata.file,
                file_name: xlsxdata.fileName,
                user_name: JSON.parse(localStorage.getItem('userData'))?.name
            }
            const header = {
                'access-token': localStorage.getItem('access_token')
            }
            const res = await ApiCall('POST', CommonApiEndPoint.import_channel_item, data, header)
            if (res.data.status === "success" && res.data.statusCode === 200) {
                setLoading(false)
                setTotalFileCount(res.data.data.total_file_count)
                setProgressShow(true)
                setTimeout(() => {
                    getImportFileLogListData()
                }, 4000)
            } else {
                if (res.data.statusCode === 400 && res.data.status === "error") {
                    toast.error(res.data.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light"
                    })
                    setLoading(false)
                }
            }
        } catch (error) {

        }
    }

    const onChannelImportData = (e) => {
        const reader = new FileReader(),
            files = e.target.files
        reader.onload = function () {
            setXlsxData({
                file: reader.result,
                fileName: files[0].name
            })
        }
        reader.readAsDataURL(files[0])
    }

    useEffect(() => {
        getImportFileLogListData(true)
    }, [])

    useEffect(() => {
        if (xlsxdata?.file) {
            handleImportFile()
        }
    }, [xlsxdata.file])
    /**
      * IW0214
      * This function is call on get channel item list
      */
    async function fetchData() {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_connect_channel}?id=${selected_company_object.id}&is_action=1`, header)
        if (res.data.status === 'success') {
            const filteredNumbers = res.data.data.row_data.filter(value => value.connection_status === "1" && value.status === "1")
            let final_data = []
            setChannelType(filteredNumbers[0]?.id)
            filteredNumbers.map(item => {
                final_data.push({
                    text: item.channel_name,
                    value: item.id,
                    logo: channel_logo[item.channel_type],
                    channel_type: item.channel_type
                })
            })
            setChannelOption(final_data)
        } else if (res.data.statusCode === 404) {
            setChannelOption([])
        }
    }
    useEffect(() => {
        if (location_state.edit) {
            fetchData()
        }
    }, [])


    return (
        <>
            <Row className='justify-content-center'>
                <Col lg='8' sm='12'>
                    <div className="munim-list-company">
                        <ModuleTitle breadCrumbTitle='Import Channel Item' links={[CommonRouter.channel_items]} />
                    </div>
                    <Card className='my-1 munim-card-border'>
                        {
                            dataImportSuccess && <CardBody><div className='munim-channel-cards gap-1'><BasicAlert alertCircleSize={25} hideAlertIcon={false} type='success' message='File import process completed successfully.' alertStyle={"my-0  mt-1 channel-success-alert"} /> </div></CardBody>
                        }
                        <CardBody className='munim-import-channel'>
                            <Card className='munim-card-border'>
                                <CardBody>
                                    {
                                        location_state?.channel_id && !location_state?.edit ? <div className='munim-connection-logo'>
                                            <img className="w-100" src={`${bucketUrl}assets/images/${location_state.channel_id.logo}`} alt="Channel logo" />
                                        </div> : <Col md='6' >
                                            <Label className='form-label' for='Connected Channel'>
                                                Connected Channel
                                            </Label>
                                            <FixSelect
                                                disabled={progressShow}
                                                id='connected_channel'
                                                value={channelType}
                                                options={channelOption}
                                                handleChange={(_, value) => setChannelType(value)}
                                            />
                                        </Col>
                                    }
                                    <div className='d-flex mt-2'>
                                        <div className='munim-import-icon mb-1 mb-sm-0'>
                                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_4050_16145)">
                                                    <path d="M0 38.8167L7.15167 31.665V38.8167H0ZM80 38.8167L72.8483 31.665V38.8167H80Z" fill="#135431" />
                                                    <path d="M56.666 0H10.8927C8.55768 0 6.66602 1.865 6.66602 4.16667V75.8333C6.66602 78.135 8.55768 80 10.8927 80H69.106C71.441 80 73.3327 78.135 73.3327 75.8333V16.6667L56.666 0Z" fill="#35BD73" />
                                                    <path d="M56.666 0L73.3327 16.6667H56.666V0Z" fill="#D9FFEB" />
                                                    <path d="M0 38.8167H80V68.8167H0V38.8167Z" fill="#229456" />
                                                    <path d="M73.3327 16.6666V33.3333L56.666 16.6666H73.3327Z" fill="#1B9754" />
                                                    <path d="M34.914 16.115H15.0007C14.0802 16.115 13.334 16.8612 13.334 17.7817C13.334 18.7021 14.0802 19.4483 15.0007 19.4483H34.914C35.8345 19.4483 36.5807 18.7021 36.5807 17.7817C36.5807 16.8612 35.8345 16.115 34.914 16.115Z" fill="#D9FFEB" />
                                                    <path d="M50.0007 22.4667H15.0007C14.0802 22.4667 13.334 23.2129 13.334 24.1333C13.334 25.0538 14.0802 25.8 15.0007 25.8H50.0007C50.9211 25.8 51.6673 25.0538 51.6673 24.1333C51.6673 23.2129 50.9211 22.4667 50.0007 22.4667Z" fill="#D9FFEB" />
                                                    <path d="M50.0007 28.8167H15.0007C14.0802 28.8167 13.334 29.5628 13.334 30.4833C13.334 31.4038 14.0802 32.15 15.0007 32.15H50.0007C50.9211 32.15 51.6673 31.4038 51.6673 30.4833C51.6673 29.5628 50.9211 28.8167 50.0007 28.8167Z" fill="#D9FFEB" />
                                                    <path d="M17.4161 50.8384L20.3211 44.9301H25.2161L20.2478 53.7434L25.3511 62.7034H20.4078L17.4178 56.6851L14.4278 62.7034H9.49609L14.5861 53.7434L9.62943 44.9301H14.5128L17.4178 50.8384H17.4161ZM31.0278 59.4084H38.4861V62.7051H26.7428V44.9317H31.0278V59.4101V59.4084ZM49.4594 57.9801C49.4594 57.3534 49.2378 56.8651 48.7944 56.5151C48.3511 56.1651 47.5711 55.8034 46.4561 55.4284C45.3411 55.0534 44.4294 54.6917 43.7211 54.3417C41.4178 53.2101 40.2661 51.6567 40.2661 49.6784C40.2661 48.6934 40.5528 47.8251 41.1261 47.0717C41.6994 46.3184 42.5111 45.7334 43.5611 45.3134C44.6111 44.8951 45.7911 44.6851 47.1011 44.6851C48.4111 44.6851 49.5244 44.9134 50.5378 45.3684C51.5511 45.8251 52.3378 46.4734 52.8994 47.3151C53.4611 48.1567 53.7411 49.1201 53.7411 50.2017H49.4694C49.4694 49.4767 49.2478 48.9167 48.8044 48.5167C48.3611 48.1184 47.7611 47.9184 47.0044 47.9184C46.2478 47.9184 45.6344 48.0867 45.1911 48.4251C44.7478 48.7634 44.5261 49.1917 44.5261 49.7134C44.5261 50.1701 44.7694 50.5817 45.2578 50.9517C45.7461 51.3217 46.6044 51.7051 47.8328 52.0984C49.0611 52.4934 50.0711 52.9184 50.8594 53.3734C52.7794 54.4801 53.7411 56.0067 53.7411 57.9517C53.7411 59.5067 53.1544 60.7267 51.9828 61.6134C50.8111 62.5001 49.2028 62.9434 47.1611 62.9434C45.7211 62.9434 44.4161 62.6851 43.2494 62.1684C42.0811 61.6517 41.2028 60.9434 40.6128 60.0451C40.0228 59.1467 39.7278 58.1101 39.7278 56.9384H44.0244C44.0244 57.8901 44.2711 58.5917 44.7628 59.0434C45.2544 59.4951 46.0544 59.7217 47.1611 59.7217C47.8694 59.7217 48.4278 59.5684 48.8394 59.2634C49.2494 58.9584 49.4561 58.5284 49.4561 57.9751L49.4594 57.9801ZM62.5694 50.8384L65.4744 44.9301H70.3694L65.4011 53.7434L70.5044 62.7034H65.5611L62.5711 56.6851L59.5811 62.7034H54.6494L59.7394 53.7434L54.7828 44.9301H59.6661L62.5711 50.8384H62.5694Z" fill="white" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_4050_16145">
                                                        <rect width="80" height="80" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                        <div className='mx-2 my-auto'>
                                            <h3>Import Item </h3>
                                            <p>Suppose you want import items from your desktop. <Button outline className='munim-button-link-none munim-display-contents' onClick={(e) => { e.preventDefault(); (window.open(`${bucketPathUrl}assets/sample/channel-items-import-sample.xlsx`, '_self')) }}>Download from here</Button></p>
                                        </div>
                                    </div>
                                    <div className='d-sm-flex d-block mt-2'>
                                        <Button disabled={progressShow || (!channelOption.length && !location_state?.channel_id?.channel_type)} tag={Label} color={(channelOption.length || location_state?.channel_id?.channel_type) ? 'primary' : 'secondary'}>
                                            {loading ? <Spinner size='sm' color='primary' /> : <>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0_4050_16013)">
                                                        <path d="M19.375 3.12548H11.25V1.25048C11.25 1.06423 11.1675 0.887976 11.0238 0.769226C10.8813 0.650476 10.69 0.599226 10.51 0.636726L0.510001 2.51173C0.366626 2.53822 0.237077 2.61414 0.143895 2.72628C0.0507121 2.83842 -0.000205713 2.97967 6.2466e-07 3.12548V16.8755C6.2466e-07 17.1755 0.213751 17.4342 0.510001 17.4892L10.51 19.3642C10.5475 19.3717 10.5863 19.3755 10.625 19.3755C10.77 19.3755 10.9113 19.3255 11.0238 19.2317C11.0945 19.1731 11.1515 19.0995 11.1906 19.0164C11.2297 18.9332 11.25 18.8424 11.25 18.7505V16.8755H19.375C19.72 16.8755 20 16.5955 20 16.2505V3.75048C20 3.40548 19.72 3.12548 19.375 3.12548ZM8.595 12.0892C8.8225 12.348 8.79625 12.743 8.53625 12.9705C8.42256 13.0704 8.27637 13.1255 8.125 13.1255C8.03593 13.1255 7.94789 13.1064 7.86682 13.0696C7.78574 13.0327 7.71351 12.9789 7.655 12.9117L5.8375 10.8355L4.24375 12.8855C4.185 12.9603 4.11003 13.0207 4.0245 13.0623C3.93896 13.1039 3.8451 13.1255 3.75 13.1255C3.61625 13.1255 3.48125 13.083 3.36625 12.9942C3.09375 12.7817 3.045 12.3892 3.25625 12.1167L4.99875 9.87673L3.28 7.91173C3.0525 7.65298 3.07875 7.25798 3.33875 7.03048C3.5975 6.80298 3.99125 6.82798 4.22125 7.08923L5.78125 8.87173L7.6325 6.49173C7.845 6.22048 8.2375 6.17048 8.51 6.38298C8.7825 6.59423 8.83125 6.98673 8.61875 7.26048L6.61875 9.83048L8.595 12.0892ZM18.75 15.6255H11.25V14.3755H13.125C13.47 14.3755 13.75 14.0955 13.75 13.7505C13.75 13.4055 13.47 13.1255 13.125 13.1255H11.25V11.8755H13.125C13.47 11.8755 13.75 11.5955 13.75 11.2505C13.75 10.9055 13.47 10.6255 13.125 10.6255H11.25V9.37548H13.125C13.47 9.37548 13.75 9.09548 13.75 8.75048C13.75 8.40548 13.47 8.12548 13.125 8.12548H11.25V6.87548H13.125C13.47 6.87548 13.75 6.59548 13.75 6.25048C13.75 5.90548 13.47 5.62548 13.125 5.62548H11.25V4.37548H18.75V15.6255Z" fill="white" />
                                                        <path d="M16.875 5.62549H15.625C15.28 5.62549 15 5.90549 15 6.25049C15 6.59549 15.28 6.87549 15.625 6.87549H16.875C17.22 6.87549 17.5 6.59549 17.5 6.25049C17.5 5.90549 17.22 5.62549 16.875 5.62549ZM16.875 8.12549H15.625C15.28 8.12549 15 8.40549 15 8.75049C15 9.09549 15.28 9.37549 15.625 9.37549H16.875C17.22 9.37549 17.5 9.09549 17.5 8.75049C17.5 8.40549 17.22 8.12549 16.875 8.12549ZM16.875 10.6255H15.625C15.28 10.6255 15 10.9055 15 11.2505C15 11.5955 15.28 11.8755 15.625 11.8755H16.875C17.22 11.8755 17.5 11.5955 17.5 11.2505C17.5 10.9055 17.22 10.6255 16.875 10.6255ZM16.875 13.1255H15.625C15.28 13.1255 15 13.4055 15 13.7505C15 14.0955 15.28 14.3755 15.625 14.3755H16.875C17.22 14.3755 17.5 14.0955 17.5 13.7505C17.5 13.4055 17.22 13.1255 16.875 13.1255Z" fill="white" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_4050_16013">
                                                            <rect width="20" height="20" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => onChannelImportData(e)}
                                                    hidden
                                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                />
                                                &nbsp;&nbsp;Choose Excel file
                                            </>}
                                        </Button>
                                        <p className='my-auto mx-2'>{xlsxdata.fileName}</p>
                                    </div>
                                    <div className='mt-2'>
                                        {
                                            progressShow && <ImportLogProgress closeIcon={true} setProgressShow={setProgressShow} progressVal={progressVal} totalFileCount={totalFileCount} successFileCount={successFileCount} />
                                        }
                                    </div>
                                </CardBody>
                            </Card>
                        </CardBody>
                    </Card>
                    <div className='d-flex justify-content-end'>
                        {
                            !location_state?.edit ? <Button color='primary' onClick={() => history.push(CommonRouter.channels)}>Next</Button> : null
                        }
                    </div>
                </Col>
            </Row>
        </>
    )
}
export default ImportChannel