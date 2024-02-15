/* eslint-disable no-unused-expressions */
import React, { useRef, useState } from "react"
import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/flatpickr.css"
import { X } from 'react-feather'
import { InputGroup, InputGroupText, Tooltip } from "reactstrap"

const RangeDatePicker = ({ handleDateChangeFormat, handleResetDate, value }) => {
    const refDate = useRef()
    const [clearTooltipOpen, setClearTooltipOpen] = useState(false)
    /**
     * IW0121
     * This function is called when click close button
     */
    const clearDate = () => {
        handleResetDate('')
        refDate.current.flatpickr.clear()
    }
    return (
        <>
            <InputGroup className='grid-date-picker'>
                <Flatpickr
                    id='range-picker'
                    className='form-control mui-header-dropdown'
                    value={value}
                    options={{
                        mode: "range",
                        dateFormat: "d-m-Y"
                    }}
                    onChange={(e) => {
                        handleDateChangeFormat(e)
                    }
                    }
                    placeholder={value ? value : 'Filter by Date'}
                    ref={refDate}
                />
                <InputGroupText id='clear_filter' onClick={() => { value ? clearDate() : '' }} >
                    <Tooltip
                        placement='right'
                        isOpen={clearTooltipOpen}
                        target='clear_filter'
                        toggle={() => { setClearTooltipOpen(!clearTooltipOpen) }}
                    >
                        Clear Filter
                    </Tooltip><X size={14} className='me-50 cursor-pointer' /></InputGroupText>
            </InputGroup>
        </>
    )
}

export default RangeDatePicker