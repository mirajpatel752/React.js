import React, { useState } from 'react'
import { Label, Tooltip } from 'reactstrap'

export default function TooltipOnLabel({ id, label, fieldName, title, className }) {
    const [tooltipOpen, setTooltipOpen] = useState(false)

    return (
        <Label className={`${className ? className : ''} form-label d-flex align-items-center m-0 cursor-pointer`} for={`custome-${fieldName}-${id}`} id={`custome-${fieldName}-${id}`}>
            <Tooltip
                placement='top'
                isOpen={tooltipOpen}
                target={`custome-${fieldName}-${id}`}
                toggle={() => setTooltipOpen(!tooltipOpen)}
            >
                {title ? title : label}
            </Tooltip>
            {label}
        </Label>
    )
}
