import React, { lazy } from 'react'
import CommonRouter from '../../helper/commonRoute'

const SettingsRoutes = [
  {
    path: CommonRouter.setting,
    component: lazy(() => import('../../pages/settings/Settings')),
    exact: true
  },
  {
    path: CommonRouter.user_activity_setting,
    component: lazy(() => import('../../pages/user_activity/UserActivity')),
    exact: true,
    defaultRoute: true,
    meta: {
      navLink: true
    }
  }
]

export default SettingsRoutes
