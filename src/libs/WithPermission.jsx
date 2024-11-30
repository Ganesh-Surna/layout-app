'use client'
import * as permissionUtils from '@/utils/permissionUtils'
import AccessDenied from './AccessDenied'

// Permission Wrapper Component
const WithPermission = ({ roles, userRoles, featureName, permissionName, children }) => {
  //   console.log('roles:', roles)
  //   console.log('user roles:', userRoles)
  const isAuthorized = permissionUtils.hasPermission(roles, userRoles, featureName, permissionName)
  //   console.log('Is authorized:', isAuthorized)

  return isAuthorized ? children : <AccessDenied />
}

export default WithPermission
