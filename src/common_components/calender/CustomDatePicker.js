import React, { useState, useEffect } from 'react'
import { DatePicker } from 'antd'
import { FormFeedback } from 'reactstrap'
import { Calendar } from 'react-feather'
import moment from 'moment'
import { getJsDate, handleFocusTab } from '../../helper/commonFunction'
import Cleave from 'cleave.js/react'
import { useHistory } from 'react-router-dom'

function hideDeaultAntCalendar(history) {
  const antPickerInput = document.querySelector('.ant-picker-input') ? document.querySelector('.ant-picker-input').style = 'display:none' : ''
  const antPicker = document.querySelector('.ant-picker') ? document.querySelector('.ant-picker').style = 'z-Index:-1' : ''
  const antPickerPanelContainerBottom = (document.querySelector('.ant-picker-panel-container')) ? document.querySelector('.ant-picker-panel-container').style.marginTop = '-20px' : ''
  const antPickerPanelContainerTop = (document.querySelector('.ant-picker-panel-container')) ? document.querySelector('.ant-picker-panel-container').style.marginBottom = "30px" : ''
  const antPickerItemSidebarCalender = document.querySelector('.ant-picker-dropdown') ? document.querySelector('.ant-picker-dropdown').style = 'z-Index:9999999999' : ''
  const calenderPosition = history?.location?.pathname?.includes('item') ? antPickerItemSidebarCalender : history?.location?.pathname?.includes('company') ? antPickerPanelContainerTop : antPickerPanelContainerBottom
  return antPickerInput, calenderPosition, antPicker
}

const CustomDatePicker = ({ value, name, fieldVal, setFieldTouch, finValApply, errors, touched, isReset, disable_date, disabled, placement, nextFocusId, minDate, maxDate }) => {
  const history = useHistory()
  const options = { date: true, delimiter: '-', datePattern: ['d', 'm', 'Y'] }
  const [date, setDate] = useState('')
  const [calenderValue, setCalenderValue] = useState('')
  const [calenderShow, setCalenderShow] = useState(false)
  useEffect(() => {
    if (calenderShow) {
      hideDeaultAntCalendar(history)
    }
  }, [calenderShow])

  /**
   * IW0111
   * this useEffect used when first time set value.
   */
  useEffect(() => {
    if (value || isReset) {
      const final_date_value = value?.length ? value : ''
      setDate(final_date_value)
      setCalenderValue(final_date_value)
    }
  }, [value, isReset])

  /**
  * IW0111
  * this useEffect used when no financial year it set date based on pas or future financial year.
  */
  useEffect(() => {
    if ((history.location.pathname.includes('create') || history.location.pathname.includes('add')) && !finValApply) {
      setDate(value)
      setCalenderValue(value?.length ? value : '')
    }
  }, [isReset])
  /**
   * IW0111
   * this function used when change date from calender.
   */
  const handleChangeDate = (date, dateStrings) => {
    let selected_date = ''
    if (dateStrings.length) {
      selected_date = `${dateStrings}`.includes('-') ? dateStrings : `${dateStrings.slice(0, 2)}-${dateStrings.slice(2, 4)}-${dateStrings.slice(4, 8)}`
    } else {
      selected_date = ''
    }
    setDate(moment(getJsDate(selected_date)).format('YYYY-MM-DD'))
    setCalenderValue(moment(getJsDate(selected_date)).format('YYYY-MM-DD'))
    fieldVal(name, selected_date ? moment(getJsDate(selected_date)).format('YYYY-MM-DD') : undefined)
    setCalenderShow(false)
  }
  /**
     * IW0111
     * this function used when user type custom date in date picker(cleave).
     */
  const handleDateChange = (custom_date) => {
    if (setFieldTouch) {
      setFieldTouch(name)
    }
    if (custom_date?.length === 6) {
      const customDate = custom_date.slice(0, 2)
      const month = custom_date.slice(3, 5)
      const year = (new Date()).getFullYear()
      const autoCompleteDate = `${customDate}-${month}-${year}`
      setDate(autoCompleteDate)
      setCalenderValue(autoCompleteDate)
      fieldVal(name, moment(getJsDate(autoCompleteDate)).format('YYYY-MM-DD'))
    } else if (custom_date?.length === 10) {
      setDate(moment(getJsDate(custom_date)).format('YYYY-MM-DD'))
      setCalenderValue(moment(getJsDate(custom_date)).format('YYYY-MM-DD'))
      fieldVal(name, moment(getJsDate(custom_date)).format('YYYY-MM-DD'))
    } else {
      if ((history.location.pathname.includes('edit') && !custom_date) || (!history.location.pathname.includes('edit') && calenderValue && date && !custom_date)) {
        setDate('')
        setCalenderValue('')
        fieldVal(name, '')
      } else {
        setCalenderValue(value?.length ? value : '')
        fieldVal(name, value)
      }
    }
    setCalenderShow(false)
  }
  /**
   * IW0111
   * this useEffect used when first time date picker open that time calender focus and date selected in cleave and when close blur.
   */
  useEffect(() => {
    if (calenderShow) {
      const date = document.getElementById(`${name}`)
      date.focus()
      date.select()
    } else {
      document.getElementById(`${name}`).blur()
    }
  }, [calenderShow])
  /**
   * IW0111
   * this function used to disable dates.
   */
  function disableDateRanges(range = { startDate: false, endDate: false }) {
    const { startDate, endDate } = range
    return function disabledDate(current) {
      let startCheck = true
      let endCheck = true
      if (startDate) {
        startCheck = current && moment(current._d).format('YYYY-MM-DD') < moment(startDate).format('YYYY-MM-DD')
      }
      if (endDate) {
        endCheck = current && moment(current._d).format('YYYY-MM-DD') > moment(endDate).format('YYYY-MM-DD')
      }
      return (startDate && startCheck) || (endDate && endCheck)
    }
  }
  return (
    <div className='container pt-0 px-0' onKeyDown={(e) => handleFocusTab(e, nextFocusId)}>
      <div className='input-group-merge munim-cal-input'>
        <Cleave className={`form-control input-dropdown-pdd ${errors && touched ? 'is-invalid' : ''}`} aria-invalid={errors && touched && true} value={date?.length ? moment(date).format('DD-MM-YYYY') : ''} id={name} onBlur={!disabled ? (e) => { handleDateChange(e.target.value) } : () => { }} autoComplete='off' placeholder={disabled ? '-' : 'DD-MM-YYYY'} disabled={disabled || disable_date} options={options} onClick={() => { setCalenderShow(!calenderShow) }} />
        <div className='munim-cal-svg-in'>
          <Calendar onClick={(disabled || disable_date) ? () => setCalenderShow(false) : () => setCalenderShow(!calenderShow)} />
        </div>
      </div>
      {calenderShow ? <>
        <div className='munim-new-date-picker'>
          <DatePicker
            format={"DD-MM-YYYY"}
            open={calenderShow}
            defaultPickerValue={finValApply && !minDate && !value ? moment(new Date(), 'DD-MM-YYYY') : ''}
            className={`${errors && touched ? 'is-invalid' : ''}`}
            value={calenderValue?.length ? moment(new Date(calenderValue), 'DD-MM-YYYY') : undefined}
            name={name}
            placement={placement}
            placeholder='DD-MM-YYYY'
            id={name}
            allowClear={false}
            onChange={(date, dateStrings) => { handleChangeDate(date, dateStrings) }}
            disabledDate={disableDateRanges({ endDate: maxDate ? new Date(maxDate) : '', startDate: minDate ? new Date(minDate) : '' })}
          />
        </div>
      </> : ''}
      {errors && touched && <FormFeedback tooltip={true}>
        {errors}
      </FormFeedback>}

    </div>
  )
}

export default CustomDatePicker
