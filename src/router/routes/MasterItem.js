import React, { lazy } from 'react'
import CommonRouter from '../../helper/commonRoute'

const MasterItemRoutes = [
    // master-Item
    {
        path: CommonRouter.master_item,
        component: lazy(() => import('../../pages/master_item/MasterItemList')),
        exact: true
    },
    {
        path: CommonRouter.mi_create,
        component: lazy(() => import('../../pages/master_item/CreateMasterItem')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.mi_edit,
        component: lazy(() => import('../../pages/master_item/CreateMasterItem')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.mi_view,
        component: lazy(() => import('../../pages/master_item/CreateMasterItem')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.bulk_mapping,
        component: lazy(() => import('../../pages/master_item/BulkMasterItem')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.menu_import_file_log,
        component: lazy(() => import('../../pages/import_file_log/index')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.master_mapped_items,
        component: lazy(() => import('../../pages/master_item/master_mapped_items/index')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.master_import_data,
        component: lazy(() => import('../../pages/master_item/ImportMasterChannelItem')),
        exact: true,
        meta: {
            navLink: true
        }
    }
]

export default MasterItemRoutes
