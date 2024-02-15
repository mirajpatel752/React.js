import React, { lazy } from 'react'
import CommonRouter from '../../helper/commonRoute'


const CompanyRoutes = [
    // company
    {
        path: CommonRouter.company,
        component: lazy(() => import('../../pages/company/index')),
        exact: true,
        defaultRoute: true
    },
    {
        path: CommonRouter.company_create,
        component: lazy(() => import('../../pages/company/create_edit_company/CreateCompany')),
        exact: true,
        meta: {
            navLink: true
        },
        defaultRoute: true
    },
    {
        path: CommonRouter.company_edit,
        component: lazy(() => import('../../pages/company/create_edit_company/EditCompany')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.company_view,
        component: lazy(() => import('../../pages/company/create_edit_company/EditCompany')),
        exact: true,
        meta: {
            navLink: true
        }
    }
]

export default CompanyRoutes
