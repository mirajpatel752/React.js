/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import CommonRouter from '../../helper/commonRoute'
import { useSelector } from 'react-redux'
import ImportLogProgress from './component/ImportLogProgress'
import { GetApiCall } from '../../helper/axios'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'

const Dashboard = () => {
  const company_data_available = useSelector((state) => state.commonReducer.company_data_available)
  const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
  const company_list = useSelector((state) => state.commonReducer.company_list)
  const history = useHistory()
  const [progressVal, setProgressVal] = useState(0)
  const [progressShow, setProgressShow] = useState(false)
  const [totalFileCount, setTotalFileCount] = useState(0)
  const [successFileCount, setSuccessFileCount] = useState(0)

  const getImportFileLogListData = async () => {
    const header = { 'access-token': localStorage.getItem('access_token') }
    const res = await GetApiCall('GET', `${CommonApiEndPoint.get_import_progress}?id=${selected_company_object.id}`, header)
    if (res.data.status === 'success') {
      setProgressVal(res.data.data.import_progress_per)
      setTotalFileCount(res.data.data.total_file_count)
      setSuccessFileCount(res.data.data.total_import_file)
      if (res.data.data.import_progress_per === 100) {
        setProgressShow(false)
      }
      if (res.data.data.import_progress_per !== 100 && res.data.data.import_progress_per !== undefined && res.data.data.import_progress_per !== null && history.location.pathname.includes("dashboard")) {
        if (res.data.data.show_progressbar_status !== 0) {
          setTimeout(() => {
            getImportFileLogListData()
          }, 2000)
        }
        if (res.data.data.show_progressbar_status === 1) {
          setProgressShow(true)
        }
      }
    }
  }
  useEffect(() => {
    if (selected_company_object.id) {
      getImportFileLogListData()
    }
  }, [])

  /**
   * IW0214
   * This effect is redirect to new user company create page
   */
  useEffect(() => {
    if (company_data_available && !company_list.length) {
      if (!window.location.href.includes(CommonRouter.company_create)) {
        history.push(CommonRouter.company_create)
      }
    }
  }, [company_data_available])
  return (
    <div className='mobile-responsive-layout '>
      {
        progressShow && <ImportLogProgress setProgressShow={setProgressShow} progressVal={progressVal} totalFileCount={totalFileCount} successFileCount={successFileCount} />
      }
      <div className='mb-1 position-relative justify-content-center'>
        <div className='dashboard-main-layout'>
          <h1> Hello e-commerce  dashboard </h1>
        </div>
      </div>
    </div>
  )
}
export default Dashboard