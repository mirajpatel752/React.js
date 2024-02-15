import React from 'react'
import { Alert, Progress } from 'reactstrap'
import CommonApiEndPoint from '../../../helper/commonApiEndPoint'
import { GetApiCall } from '../../../helper/axios'
import { useSelector } from 'react-redux'

const ImportLogProgress = ({ showWarning, progressVal, setProgressShow, successFileCount, totalFileCount, closeIcon }) => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const updateImportProgress = async () => {
        const header = {
            'access-token': localStorage.getItem('access_token'), id: selected_company_object.id
        }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.update_import_progress}?id=${selected_company_object.id}`, header)
        if (res.data.status === 'success') {
            setProgressShow(false)
        } else {
            notify(res.data.message, 'error')
        }
    }
    return (
        <>
            <Alert color={'default'} toggle={closeIcon === true ? false : () => updateImportProgress()} isOpen={showWarning} className='p-1 border border-success'>
                <div>
                    <div className='d-flex align-items-end gap-1'>
                        <div className='alert-body px-0 w-100'>
                            <h6 className='m-0 fs-4 fw-bold'>
                                Import data  {`(${successFileCount} out of ${totalFileCount} completed)`}
                            </h6>
                            <Progress className='progress-bar-success mt-1' value={progressVal} style={{ width: '100%' }} />
                        </div>
                        <div className='fs-4 munim-edit-label-mb text-dark fw-bold'>{progressVal}%</div>
                    </div>
                </div>
            </Alert>
        </>
    )
}
export default ImportLogProgress