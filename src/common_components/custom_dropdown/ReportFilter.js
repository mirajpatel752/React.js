import React, { useState } from 'react'
import { Edit, Trash2 } from 'react-feather'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle, Button } from 'reactstrap'
import TooltipOnLabel from '../tooltip/TooltipOnLabel'
import DeleteModal from '../pop_up_modal/DeleteModal'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useNotify from '../../custom_hooks/useNotify'
import { ApiCall } from '../../helper/axios'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'

const ReportFilter = ({ listOption, redirectUrl, handleDeleteFilter, breadCrumbTitle }) => {
  const history = useHistory()
  const notify = useNotify()
  const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
  const [deleteFilterLabel, setDeleteFilterLabel] = useState('')
  const [deleteFilterId, setDeleteFilterId] = useState('')
  const deleteFilter = async () => {
    const header = { 'access-token': localStorage.getItem('access_token'), id: selected_company_object.id }
    const res = await ApiCall(
      'DELETE',
      `${CommonApiEndPoint.delete_filter}?id=${deleteFilterId}`,
      null,
      header
    )
    if (res.data.status === 'success') {
      notify(res.data.message, 'success')
      handleDeleteFilter(deleteFilterLabel)
    } else {
      notify(res.data.message, 'error')
    }
    setDeleteFilterLabel('')
  }
  const handleDeleteFilterModal = (flag = false) => {
    if (flag) {
      deleteFilter()
    } else {
      setDeleteFilterLabel('')
    }
  }

  return (
    <div className='demo-inline-spacing'>
      <UncontrolledButtonDropdown className='m-0'>
        <DropdownToggle outline className='dropdown-toggle-split munim-font-color' color='secondary' caret>{breadCrumbTitle}</DropdownToggle>
        <DropdownMenu>
          {
            listOption?.map((item, index) => <DropdownItem key={`pagination_${item.filter_name}`} onClick={e => {
              if (e.target.textContent !== breadCrumbTitle) {
                e.preventDefault()
                history.push(redirectUrl, { customFilterDetail: item })
              }
            }}>
              <div className='d-flex justify-content-between w-100 gap-1'>
                <div className='munim-module-dropdown'>{item.filter_name}</div>
                {
                  item.is_edit ? <div className='d-flex justify-content-end munim-gap-6'>
                    <div>
                      <TooltipOnLabel id={`${index}`} fieldName={'filter_edit_button'} label={<>
                        <Edit size={14} onClick={(e) => {
                          e.stopPropagation()
                          history.push(redirectUrl, {
                            customFilterDetail: {
                              ...item, editMode: true, tab_id: Number(item.tab_id)
                            }
                          })
                        }} />
                      </>} title='Edit' />
                    </div>
                    <div>
                      <TooltipOnLabel id={`${index}`} fieldName={'filter_delete_button'} label={<>
                        <Trash2 size={14} onClick={(e) => {
                          e.stopPropagation()
                          setDeleteFilterId(item.id)
                          setDeleteFilterLabel(item.filter_name)
                        }} />
                      </>} title='Delete' />
                    </div>
                  </div> : ''
                }
              </div>
            </DropdownItem>
            )
          }
        </DropdownMenu>
      </UncontrolledButtonDropdown>
      {deleteFilterLabel ? <DeleteModal
        deletePopUpActive={deleteFilterLabel}
        popUpTitle='Delete Filter'
        secondaryLabel='Cancel'
        primaryLabel='Delete'
        popUpContent={`Are you sure, you want to delete ${deleteFilterLabel} filter?`}
        handleDeletePopUp={handleDeleteFilterModal} /> : ''}
    </div>
  )
}

export default ReportFilter
