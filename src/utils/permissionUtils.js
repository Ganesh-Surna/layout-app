export function hasPermission(roles, userRoles, featureName, permissionName) {
    return roles?.some(
        role =>
            userRoles.includes(role.name) &&
            role.features.some(feature => feature.name === featureName && feature.permissions.includes(permissionName))
    )
}
