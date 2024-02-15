import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'reactstrap'
import { handleFocusTab } from '../../helper/commonFunction'
export default function CustomButton({ handleClick, color, type, label, outline, loader, disabled, tabIndex, autoFocus, block, mobileBtnNone, nextFocusId }) {
    const [isButtonClick, setIsButtonClick] = useState(false)
    const [isEnterPress, setIsEnterPress] = useState(false)
    const [totalClick, setTotalClick] = useState(0)
    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            setIsEnterPress(true)
            setIsButtonClick(true)
        }
        if (nextFocusId && e.keyCode === 9) {
            handleFocusTab(e, nextFocusId)
        }
    }
    useEffect(() => {
        if (isButtonClick) {
            handleClick()
            setIsButtonClick(false)
        }
    }, [isButtonClick])
    const handleButtonClick = () => {
        if (isEnterPress) {
            setTotalClick(2)
        } else {
            setIsButtonClick(true)
        }
    }
    useEffect(() => {
        if (totalClick) {
            setIsEnterPress(false)
            setTotalClick(0)
        }
    }, [totalClick])

    return (
        <>
            <Button outline={outline} onKeyDown={onKeyDown} className={`me-1 mb-0 ${mobileBtnNone}`} color={color} block={block} type={type} autoFocus={autoFocus} onClick={!disabled ? () => handleButtonClick() : () => { }} tabIndex={tabIndex} disabled={disabled || loader} >
                {loader ? <Spinner size='sm' color='primary' /> : label}
            </Button>

        </>
    )
}
