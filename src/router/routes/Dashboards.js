import React, { lazy } from 'react'
import CommonRouter from '../../helper/commonRoute'


const DashboardRoutes = [
  // Dashboards
  {
    path: CommonRouter.dashboard,
    component: lazy(() => import('../../pages/dashboard/index')),
    exact: true,
    defaultRoute: true
  }
]

export default DashboardRoutes
