import React, { lazy } from 'react'
import CommonRouter from '../../helper/commonRoute'


const ProfileRoutes = [
    // profile
    {
        path: CommonRouter.profile,
        component: lazy(() => import('../../pages/profile')),
        exact: true
    }
]

export default ProfileRoutes
