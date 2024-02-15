// ** Routes Imports
import DashboardRoutes from './Dashboards'
import CommonRouter from '../../helper/commonRoute'
import SettingRoutes from './Settings'
import ProfileRoutes from './Profile'
import MasterItemRoutes from './MasterItem'
import CompanyRoutes from './Company'
import ChannelRoutes from './Channel'
import OrdersRoutes from "./Orders"
// ** Document title
const TemplateTitle = '%s - Munim'
// ** Default Route
const DefaultRoute = CommonRouter.dashboard

// ** Merge Routes
const Routes = [...DashboardRoutes, ...SettingRoutes, ...ProfileRoutes, ...MasterItemRoutes, ...CompanyRoutes, ...ChannelRoutes, ...OrdersRoutes]

export { DefaultRoute, TemplateTitle, Routes }
