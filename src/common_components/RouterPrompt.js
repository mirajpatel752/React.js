import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { handlePageRefresh } from '../helper/commonFunction'
import { setShowHeaderAction } from '../redux/headerActionSlice'
import LeavePageModel from './pop_up_modal/LeavePageModal'
import CommonRouter from '../helper/commonRoute'
export function RouterPrompt(props) {
  const dispatch = useDispatch()
  const { when, title, frwText, closeText, show, content } = props

  const history = useHistory()

  const [showPrompt, setShowPrompt] = useState(show)
  const [currentPath, setCurrentPath] = useState('')
  const [currentPathState, setCurrentPathState] = useState('')

  useEffect(() => {
    if (when) {
      history.block((prompt) => {
        setCurrentPath(prompt.pathname)
        setCurrentPathState(prompt.state)
        setShowPrompt(true)
        return 'true'
      })
    } else {
      history.block(() => { })
    }

    return () => {
      history.block(() => { })
      if (!localStorage.getItem('access_token')) {
        history.replace(CommonRouter.log_in)
      }
    }
  }, [history, when])

  const handleOK = useCallback(async () => {
    history.block(() => { })
    window.removeEventListener("beforeunload", handlePageRefresh)
    history.push(currentPath, currentPathState)
  }, [currentPath, history])

  const handleCancel = useCallback(() => {
    setShowPrompt(false)
  }, [])


  const closePopUp = (flag) => {
    setShowPrompt(false)
    if (flag) {
      handleOK()
      dispatch(setShowHeaderAction({ display: false, title: '', mainAction: '', secondaryAction: '' }))
    } else {
      handleCancel()
    }
  }
  return (
    <>
      {showPrompt ? <LeavePageModel leavePagePopUpActive={showPrompt} handleLeavePopUp={closePopUp} popUpTitle={title} popUpContent={content} secondaryLabel={closeText} primaryLabel={currentPath === window.location.pathname ? 'Discard Changes' : frwText} changeTab={currentPath === window.location.pathname} /> : ''}
    </>
  )
}

