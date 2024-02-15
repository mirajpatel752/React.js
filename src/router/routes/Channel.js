import React, { lazy } from 'react'
import CommonRouter from '../../helper/commonRoute'


const ChannelRoutes = [
    // Channel
    {
        path: CommonRouter.channels,
        component: lazy(() => import('../../pages/channel/index')),
        exact: true
    },
    {
        path: CommonRouter.channel_list,
        component: lazy(() => import('../../pages/channel/ChannelList')),
        exact: true
    },
    {
        path: CommonRouter.channel_connection,
        component: lazy(() => import('../../pages/channel/Connection')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.channel_connection_edit,
        component: lazy(() => import('../../pages/channel/Connection')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.import_channel_item,
        component: lazy(() => import('../../pages/channel/ImportChannelItem')),
        exact: true,
        meta: {
            navLink: true
        }
    },
    {
        path: CommonRouter.channel_items,
        component: lazy(() => import('../../pages/channel_item/index')),
        exact: true
    },
    {
        path: CommonRouter.mapped_item,
        component: lazy(() => import('../../pages/mapped_item/index')),
        exact: true
    },
    {
        path: CommonRouter.channel_product_mapping,
        component: lazy(() => import('../../pages/channel/channel_product_mapping/index')),
        exact: true
    }

]

export default ChannelRoutes
