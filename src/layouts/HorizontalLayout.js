// ** Core Layout Import
// !Do not remove the Layout import
import React from 'react'
import Layout from '@layouts/HorizontalLayout'

const HorizontalLayout = props => {
  const navigation = []
  return (
    <Layout menuData={navigation} {...props}>
      {props.children}
    </Layout>
  )
}

export default HorizontalLayout
