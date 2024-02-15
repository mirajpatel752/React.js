import React, { useState } from 'react'
import { Label, Tooltip } from 'reactstrap'

export default function CustomeTooltip({ id, label, fieldname }) {
    const [tooltipOpen, setTooltipOpen] = useState(false)

    return (
        <Label className='form-label d-flex align-items-center m-0 ' for={`custome-${fieldname}-${id}`} id={`custome-${fieldname}-${id}`}>
            <Tooltip
                placement='top'
                isOpen={tooltipOpen}
                target={`custome-${fieldname}-${id}`}
                toggle={() => setTooltipOpen(!tooltipOpen)}
                className='tooltip-label'
            >
                {label}
            </Tooltip>
            <svg role='button' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=''>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        </Label>
    )
}
