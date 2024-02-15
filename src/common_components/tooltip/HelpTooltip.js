import React, { useState } from 'react'
import { HelpCircle } from 'react-feather'
import { Label, Tooltip } from 'reactstrap'

const HelpTooltip = ({ label, id, circle, isRequired, color, className }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false)
    return (
        <>
            <span className={` m-0 ${isRequired ? 'munim-tooltip-ml-6' : ''}`} id={`tooltip-${id}`}>
                <span className='munim-svg munim-svg-help-icon'>
                    <Tooltip
                        className={className}
                        placement='top'
                        isOpen={tooltipOpen}
                        target={`tooltip-${id}`}
                        toggle={() => setTooltipOpen(!tooltipOpen)}
                    >
                        {label}
                    </Tooltip>
                    {circle ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9 8.99902H7V8.85102C7 7.97502 7.306 7.35202 8 6.99902C8.385 6.80402 9 6.43102 9 5.99902C8.98848 5.74154 8.87809 5.49843 8.69182 5.3203C8.50554 5.14217 8.25774 5.04276 8 5.04276C7.74226 5.04276 7.49446 5.14217 7.30818 5.3203C7.12191 5.49843 7.01152 5.74154 7 5.99902H5C5 4.34502 6.346 2.99902 8 2.99902C9.654 2.99902 11 3.99902 11 5.99902C11 7.99902 9 8.16402 9 8.99902ZM7 12.999H9V10.999H7V12.999ZM8 -0.000976562C5.87827 -0.000976562 3.84344 0.841878 2.34315 2.34217C0.842855 3.84246 0 5.87729 0 7.99902C0 10.1208 0.842855 12.1556 2.34315 13.6559C3.84344 15.1562 5.87827 15.999 8 15.999C10.1217 15.999 12.1566 15.1562 13.6569 13.6559C15.1571 12.1556 16 10.1208 16 7.99902C16 5.87729 15.1571 3.84246 13.6569 2.34217C12.1566 0.841878 10.1217 -0.000976562 8 -0.000976562Z" fill={color ? color : "black"} />
                    </svg> : <HelpCircle height={'16'} width={'16'} stroke={color ? color : "black"} onClick={() => setTooltipOpen(!tooltipOpen)} />}
                </span>
            </span>
        </>
    )
}

export default HelpTooltip