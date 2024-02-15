// ** React Imports
import React, { Suspense, Fragment, useEffect } from 'react'
// ** Utils
import { isUserLoggedIn } from '@utils'
import { useLayout } from '@hooks/useLayout'
import { useRouterTransition } from '@hooks/useRouterTransition'
// ** Custom Components
import LayoutWrapper from '@layouts/components/layout-wrapper'
// ** Router Components
import { BrowserRouter as AppRouter, Route, Switch, Redirect } from 'react-router-dom'
// ** Routes & Default Routes
import { Routes } from './routes'
// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'
import useTitle from '../custom_hooks/useTitle'
import { useSelector } from 'react-redux'
import CommonRouter from '../helper/commonRoute'

const Router = () => {
  // ** Hooks
  const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
  const { layout, setLayout, setLastLayout } = useLayout()
  const { transition, setTransition } = useRouterTransition()
  // ** Default Layout
  const DefaultLayout = layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout'
  // ** All of the available layouts
  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout }
  // ** Current Active Item
  const currentActiveItem = null
  // ** Return Filtered Array of Routes & Paths
  const LayoutRoutesAndPaths = layout => {
    const LayoutRoutes = []
    const LayoutPaths = []

    if (Routes) {
      Routes.filter(route => {
        // ** Checks if Route layout or Default layout matches current layout
        if (route.layout === layout || (route.layout === undefined && DefaultLayout === layout)) {
          LayoutRoutes.push(route)
          LayoutPaths.push(route.path)
        }
      })
    }
    return { LayoutRoutes, LayoutPaths }
  }
  /**
   ** Final Route Component Checks for Login & User Role and then redirects to the route
   */
  const FinalRoute = props => {
    const route = props.route
    const setTitle = useTitle()
    useEffect(() => {
      setTitle()
    }, [setTitle])

    // let action, resource
    // ** Assign vars based on route meta
    // if (route.meta) {
    //  action = route.meta.action ? route.meta.action : null
    //  resource = route.meta.resource ? route.meta.resource : null
    // }
    if (
      (!isUserLoggedIn() && route.meta === undefined) ||
      (!isUserLoggedIn() && route.meta && !route.meta.authRoute && !route.meta.publicRoute)
    ) {
      /**
       ** If user is not Logged in & route meta is undefined
       ** OR
       ** If user is not Logged in & route.meta.authRoute, !route.meta.publicRoute are undefined
       ** Then redirect user to login
       */
      return <Redirect to={window.open(CommonRouter.redirect_to_account, '_parent')} />
    } else if (route.meta && route.meta.authRoute && isUserLoggedIn()) {
      // ** If route has meta and authRole and user is Logged in then redirect user to home page (DefaultRoute)
      return <Redirect to='/' />
    } else {
      // ** If none of the above render component
      return <route.component {...props} />
    }
  }

  // ** Return Route to Render
  const ResolveRoutes = () => {
    return Object.keys(Layouts).map((layout, index) => {
      // ** Convert Layout parameter to Layout Component
      // ? Note: make sure to keep layout and component name equal

      const LayoutTag = Layouts[layout]

      // ** Get Routes and Paths of the Layout
      let { LayoutRoutes } = LayoutRoutesAndPaths(layout)
      const { LayoutPaths } = LayoutRoutesAndPaths(layout)
      //** Do not remove this code, this code is prevent unauthorised access of route before company creation */
      if (LayoutPaths.includes(CommonRouter.dashboard) && !selected_company_object.id) {
        LayoutRoutes = LayoutRoutes.filter((item) => item.defaultRoute)
      }
      //** Do not remove above code, this code is prevent unauthorised access of route before company creation */

      // ** We have freedom to display different layout for different route
      // ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
      // ** that we want to implement like VerticalLayout or HorizontalLayout
      // ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

      // ** RouterProps to pass them to Layouts
      const routerProps = {}

      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            routerProps={routerProps}
            setLastLayout={setLastLayout}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            <Switch>
              {LayoutRoutes.map(route => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={props => {
                      // ** Assign props to routerProps
                      Object.assign(routerProps, {
                        ...props,
                        meta: route.meta
                      })

                      return (
                        <Fragment>
                          {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}

                          {route.layout === 'BlankLayout' ? (
                            <Fragment>
                              <FinalRoute route={route} {...props} />
                            </Fragment>
                          ) : (
                            <LayoutWrapper
                              layout={DefaultLayout}
                              transition={transition}
                              setTransition={setTransition}
                              /* Conditional props */
                              /*eslint-disable */
                              {...(route.appLayout
                                ? {
                                  appLayout: route.appLayout
                                }
                                : {})}
                              {...(route.meta
                                ? {
                                  routeMeta: route.meta
                                }
                                : {})}
                              {...(route.className
                                ? {
                                  wrapperClass: route.className
                                }
                                : {})}
                            /*eslint-enable */
                            >
                              <Suspense fallback={null}>
                                <FinalRoute route={route} {...props} />
                              </Suspense>
                            </LayoutWrapper>
                          )}
                        </Fragment>
                      )
                    }}
                  />
                )
              })}
              <Route
                path='*'
                render={() => {
                  return isUserLoggedIn() ? <Redirect to={CommonRouter.dashboard} /> : window.open(CommonRouter.redirect_to_account, '_parent')
                }} />
            </Switch>
          </LayoutTag>
        </Route>
      )
    })
  }

  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME} getUserConfirmation={() => {
      /* Empty callback to block the default browser prompt */
    }}>
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}
        <Route
          exact
          path='/'
          render={() => {
            return isUserLoggedIn() ? <Redirect to={window.location.search.includes('code=') ? `${CommonRouter.channel_connection}${window.location.search}` : CommonRouter.dashboard} /> : <Redirect to={window.open(CommonRouter.redirect_to_account, '_parent')} />
          }}
        />
        {ResolveRoutes()}

        {/* NotFound Error page */}
        <Route
          path='*'
          render={() => {
            return isUserLoggedIn() ? <Redirect to={CommonRouter.dashboard} /> :  <Redirect to={window.open(CommonRouter.redirect_to_account, '_parent')} />
          }} />
      </Switch>
    </AppRouter>
  )
}

export default Router
