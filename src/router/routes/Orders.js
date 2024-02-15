import React, { lazy } from 'react'
import CommonRouter from '../../helper/commonRoute'

const OrdersRoutes = [
  {
    path: CommonRouter.orders,
    component: lazy(() => import('../../pages/orders/index')),
    exact: true
  }
]

export default OrdersRoutes
