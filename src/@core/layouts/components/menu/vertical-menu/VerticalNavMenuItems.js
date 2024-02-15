// ** Vertical Menu Components
import React, { useState, useContext } from 'react'
import VerticalNavMenuLink from './VerticalNavMenuLink'
import VerticalNavMenuGroup from './VerticalNavMenuGroup'
import VerticalNavMenuSectionHeader from './VerticalNavMenuSectionHeader'
import { AbilityContext } from '@src/utility/context/Can'

// ** Utils
import {
  canViewMenuItem,
  canViewMenuGroup,
  resolveVerticalNavMenuItemComponent as resolveNavItemComponent
} from '@layouts/utils'

const VerticalMenuNavItems = props => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const ability = useContext(AbilityContext)
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader
  }
  // ** Render Nav Menu Items
  const RenderNavItems = props.items?.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)]
    if (item.children) {
      return canViewMenuGroup(item, ability) && <TagName item={item} index={index} tooltipOpen={tooltipOpen} setTooltipOpen={setTooltipOpen} key={item.id} {...props} />
    }
    return canViewMenuItem(item, ability) && <TagName key={item.id || item.header} tooltipOpen={tooltipOpen} setTooltipOpen={setTooltipOpen} item={item}  {...props} />
  })

  return RenderNavItems
}

export default VerticalMenuNavItems
