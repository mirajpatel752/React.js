// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'
import React, { useState, useEffect } from 'react'
// ** Menu Items Array
//import navigation from '@src/navigation/vertical'
import { getIcon } from '../helper/commonFunction'
import { useSelector } from 'react-redux'

const fixMenuOption = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "Dashboard",
    badge: "light-warning",
    navLink: "/dashboard",
    meta: {
      authRoute: true
    }
  },
  {
    id: "master_item",
    title: "Master Item",
    icon: "Master-Item",
    badge: "light-warning",
    children: [
      {
        id: "2_1",
        title: "Items",
        icon: "item",
        navLink: "/master-item"
      },
      {
        id: "2_2",
        title: "Mapping",
        icon: "MasterMapping",
        navLink: "/bulk-mapping"
      },
      {
        id: "2_3",
        title: "Import",
        icon: "import",
        navLink: "/master-import-data"
      },
      {
        id: "2_4",
        title: "Mapped Items",
        icon: "Mapped",
        navLink: "/master-mapped-items"
      }
    ]
  },
  {
    id: "channel",
    title: "Channel",
    icon: "Channel",
    badge: "light-warning",
    icon: "Channel",
    children: [
      {
        id: "4_1",
        icon: "ListChannel",
        title: "List",
        navLink: "/channels"
      },
      {
        id: "4_2",
        title: "Items",
        icon: "item",
        navLink: "/channel-items"
      },
      {
        id: "4_3",
        icon: "Mapped",
        title: "Mapped Items",
        navLink: "/mapped-item"
      }
    ]
  },
  {
    id: "orders",
    title: "Orders",
    icon: "Orders",
    badge: "light-warning",
    navLink: "/orders",
    meta: {
      authRoute: true
    }
  }
]
const settingMenu = {
  id: '3',
  title: "Setting",
  icon: "Settings",
  badge: "light-warning",
  navLink: "/setting",
  meta: {
    authRoute: true
  }
}

const VerticalLayout = props => {
  const isFullScreen = useSelector((state) => state.listViewReducer.isFullScreen)
  const [menuData, setMenuData] = useState([])
  const replaceIconComponets = (menuData) => {
    return menuData.map((menuItem) => {
      let newObject = {}
      newObject = { ...menuItem, icon: getIcon(menuItem.icon) }
      if (menuItem.hasOwnProperty('children')) {
        newObject = { ...newObject, children: replaceIconComponets(newObject.children) }
      }
      return newObject
    })
  }
  useEffect(() => {
    const data = replaceIconComponets([...fixMenuOption, settingMenu])
    setMenuData(data)
  }, [])
  return (
    <div className={`munim-side-menu h-100 ${isFullScreen ? 'munim-table-full-screen' : ''}`}>
      <Layout menuData={menuData} {...props}>
        {props.children}
      </Layout>
    </div>
  )
}

export default VerticalLayout
