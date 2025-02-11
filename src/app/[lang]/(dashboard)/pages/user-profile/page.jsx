// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/pages/account-settings'

const AccountTab = dynamic(() => import('@views/pages/account-settings/account'))
const NetworkTreeTab = dynamic(() => import('@views/pages/account-settings/network-tree'))
const SecurityTab = dynamic(() => import('@views/pages/account-settings/security'))
const BillingPlansTab = dynamic(() => import('@views/pages/account-settings/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/pages/account-settings/notifications'))
const ConnectionsTab = dynamic(() => import('@views/pages/account-settings/connections'))

// Vars
const tabContentList = () => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  'network-tree': <NetworkTreeTab />,
  // 'billing-plans': <BillingPlansTab />,
  // notifications: <NotificationsTab />,
  // connections: <ConnectionsTab />
})

const AccountSettingsPage = () => {
  return <AccountSettings tabContentList={tabContentList()} />
}

export default AccountSettingsPage

// // Next Imports
// import dynamic from 'next/dynamic'

// // Component Imports
// import UserProfile from '@views/pages/user-profile'

// const ProfileTab = dynamic(() => import('@views/pages/user-profile/profile/index'))
// const TeamsTab = dynamic(() => import('@views/pages/user-profile/teams/index'))
// const ProjectsTab = dynamic(() => import('@views/pages/user-profile/projects/index'))
// const ConnectionsTab = dynamic(() => import('@views/pages/user-profile/connections/index'))

// // Vars
// const tabContentList = data => ({
//   profile: <ProfileTab data={data?.users.profile} />,
//   teams: <TeamsTab data={data?.users.teams} />,
//   projects: <ProjectsTab data={data?.users.projects} />,
//   connections: <ConnectionsTab data={data?.users.connections} />
// })

// const getData = async () => {
//   // Vars
//   const res = await fetch(`${process.env.API_URL}/pages/profile`)

//   if (!res.ok) {
//     throw new Error('Failed to fetch profileData')
//   }

//   return res.json()
// }

// const ProfilePage = async () => {
//   // Vars
//   const data = await getData()

//   return <UserProfile data={data} tabContentList={tabContentList(data)} />
// }

// export default ProfilePage
