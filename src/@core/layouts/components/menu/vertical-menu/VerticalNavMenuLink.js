import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Badge, Tooltip } from 'reactstrap'
import { getDetectOs } from '../../../../../helper/commonFunction'
let timeout
const VerticalNavMenuLink = ({
  item,
  activeItem,
  setActiveItem,
  currentActiveItem,
  tooltipOpen,
  setTooltipOpen
}) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink
  const { t } = useTranslation()
  const location = useLocation()
  // const [tooltipOpen, setTooltipOpen] = useState(false)
  const detected_os = getDetectOs(navigator.platform)

  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(currentActiveItem)
    }
  }, [location])
  const keydown = (e) => {
    if (document.activeElement.id === 'munim-text-area' && e.keyCode === 13) {
    } else {
      if (e.keyCode === 27 && document.getElementsByClassName('munim-short-cut-menu').length) {
        if (timeout) {
          clearTimeout(timeout)
        }
        setTooltipOpen(false)
      }
      if ((e.altKey && (e.shiftKey || e.ctrlKey) && [72, 77, 73, 76, 85, 84, 83, 82, 67, 81, 68, 66, 80, 69, 86, 74, 79, 71, 78, 65, 75].includes(e.keyCode)) || e.keyCode === 112 || (e.ctrlKey && e.shiftKey && e.keyCode === 70)) {
        e.preventDefault()
        e.stopPropagation()
        window.stop()
        if (timeout) {
          clearTimeout(timeout)
        }
        setTooltipOpen(false)
      } else if (e.altKey && e.keyCode === 18 && !e.ctrlKey && !e.shiftKey && !document.getElementsByClassName('munim-nav-top-bar').length) {
        e.preventDefault()
        e.stopPropagation()
        if (timeout) {
          clearTimeout(timeout)
        }
        if (document.getElementsByClassName('munim-short-cut-menu').length) {
          setTooltipOpen(false)
        } else {
          timeout = setTimeout(() => {
            setTooltipOpen(!document.getElementsByClassName('munim-short-cut-menu').length)
          }, 1000)
        }
      }
    }
  }

  const onWindowBlur = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    setTooltipOpen(false)
  }
  useEffect(() => {
    document.onkeydown = keydown
    window.onblur = onWindowBlur
  }, [])
  return (
    <>
      <li
        id={item.id}
        className={classnames({
          'nav-item single': !item.children,
          disabled: item.disabled,
          active: item.navLink === activeItem,
          'setting-menu': item.id === '3'
        })}
      >
        <LinkTag
          disabled={true}
          className={`d-flex align-items-center ${tooltipOpen === true ? 'munim-short-cut-link' : ''}`}
          target={item.newTab ? '_blank' : undefined}
          /*eslint-disable */
          {...(item.externalLink === true
            ? {
              href: item.navLink || '/'
            }
            : {
              to: item.navLink || '/',
              isActive: match => {
                if (!match) {
                  return false
                }

                if (match.url &&
                  match.url !== '' &&
                  match.url === item.navLink) {
                  currentActiveItem = item.navLink
                }
              }
            })}
          onClick={e => {
            if (item.navLink?.length === 0 ||
              item.navLink === '#' ||
              item.disabled === true) {
              e.preventDefault()
            }
          }}
        >
          {item.icon}
          <div className={`d-flex align-items-center justify-content-between ${tooltipOpen === true ? 'munim-short-cut-menu' : ''}`}>
            <span className='menu-item text-truncate lh-sm munim-menu-fnt'>{t(item.title)}</span>
            {tooltipOpen && <Badge className='munim-navbar-short-cut' color='primary'>{item.id === 'dashboard' ? `${detected_os}+SHIFT+H` : item.id === '4_2' ? `${detected_os}+SHIFT+L` : item.id === '4_1' ? `${detected_os}+SHIFT+I` : item.id === '4_3' ? `${detected_os}+SHIFT+U` : item.id === '4_4' ? `${detected_os}+SHIFT+T` : item.id === '4_5' ? `${detected_os}+SHIFT+Y` : item.id === '4_6' ? `${detected_os}+SHIFT+K` : item.id === '2_4' ? `${detected_os}+SHIFT+Q` : item.id === '2_5' ? `${detected_os}+CTRL+D` : item.id === '2_1' ? `${detected_os}+SHIFT+S` : item.id === '2_2' ? `${detected_os}+SHIFT+R` : item.id === '2_3' ? `${detected_os}+SHIFT+C` : item.id === '2_6' ? `${detected_os}+CTRL+B` : item.id === '1_4' ? `${detected_os}+CTRL+P` : item.id === '1_1' ? `${detected_os}+SHIFT+B` : item.id === '1_2' ? `${detected_os}+SHIFT+P` : item.id === '1_3' ? `${detected_os}+SHIFT+D` : item.id === '5_1' ? `${detected_os}+SHIFT+E` : item.id === '7_1' ? `${detected_os}+SHIFT+V` : item.id === '7_2' ? `${detected_os}+SHIFT+J` : item.id === '7_3' ? `${detected_os}+CTRL+G` : item.id === '6' ? `${detected_os}+SHIFT+O` : item.id === '8' ? `${detected_os}+SHIFT+G` : item.id === '3' ? `${detected_os}+CTRL+U` : item.id === '9_1' ? `${detected_os}+SHIFT+A` : ''}</Badge>}
          </div>
          {item.badge && item.badgeText ? (
            <Badge className='ms-auto me-1' color={item.badge} pill>
              {item.badgeText}
            </Badge>
          ) : null}
        </LinkTag>
      </li>
    </>
  )
}

export default VerticalNavMenuLink
