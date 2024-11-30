'use client'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import HandymanIcon from '@mui/icons-material/Handyman'
import { Folder } from '@mui/icons-material'
import DnsIcon from '@mui/icons-material/Dns'
import PunchClockIcon from '@mui/icons-material/PunchClock'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import ReviewsIcon from '@mui/icons-material/Reviews'
import RBACMenuWrapper from '@/libs/RBACMenuWrapper'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import * as clientApi from '@/app/api/client/client.api'
import * as permissionUtils from '@/utils/permissionUtils'
import { FEATURES_LOOKUP } from '@/lookups/features-lookup'
import { ROLES_LOOKUP } from '@/lookups/roles-lookup'
import { PERMISSIONS_LOOKUP } from '@/lookups/permissions-lookup'
import * as RestApi from '@/utils/restApiUtil'
import { API_URLS } from '@/configs/apiConfig'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()
  const { data: session } = useSession()
  const [roles, setRoles] = useState([])

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale, id } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const userRoles = session?.user?.roles || ['USER']

  const getRolesData = async () => {
    console.log('Fetching Roles Data now.....')
    const result = await RestApi.get(`${API_URLS.v0.ROLE}`)
    // const result = await clientApi.getAllRoles() // Change this to the correct endpoint for roles
    if (result?.status === 'success') {
      console.log('Roles Fetched result', result)
      setRoles(result?.result || []) // Store the fetched roles data
      // dispatch(roleSliceActions.refreshRoles(result?.result || []))
    } else {
      console.log('Error:' + result?.message)
      console.log('Error Fetching roles:', result)
    }
  }

  useEffect(() => {
    getRolesData() // Call the updated function to fetch roles data
  }, [])

  const featurePermissions = [
    { key: 'hasHomeViewPermission', feature: FEATURES_LOOKUP.HOME },
    { key: 'hasPublicQuizzesViewPermission', feature: FEATURES_LOOKUP.PUBLIC_QUIZZES },
    { key: 'hasPublicGamesViewPermission', feature: FEATURES_LOOKUP.PUBLIC_GAMES },
    { key: 'hasMyQuizzesViewPermission', feature: FEATURES_LOOKUP.MY_QUIZZES },
    { key: 'hasMyGamesViewPermission', feature: FEATURES_LOOKUP.MY_GAMES },
    { key: 'hasMyUtilitiesViewPermission', feature: FEATURES_LOOKUP.MY_UTILITIES },
    { key: 'hasMyProgressViewPermission', feature: FEATURES_LOOKUP.MY_PROGRESS },
    { key: 'hasMyProfileViewPermission', feature: FEATURES_LOOKUP.MY_PROFILE },
    { key: 'hasReferEarnViewPermission', feature: FEATURES_LOOKUP.REFER_EARN },
    { key: 'hasReviewQuizzesViewPermission', feature: FEATURES_LOOKUP.REVIEW_QUIZZES },
    { key: 'hasReviewGamesViewPermission', feature: FEATURES_LOOKUP.REVIEW_GAMES },
    { key: 'hasManageAdvtViewPermission', feature: FEATURES_LOOKUP.MANAGE_ADVT },
    { key: 'hasManageQuizzesViewPermission', feature: FEATURES_LOOKUP.MANAGE_QUIZZES },
    { key: 'hasManageGamesViewPermission', feature: FEATURES_LOOKUP.MANAGE_GAMES },
    { key: 'hasManageEventsViewPermission', feature: FEATURES_LOOKUP.MANAGE_EVENTS },
    { key: 'hasManageUsersViewPermission', feature: FEATURES_LOOKUP.MANAGE_USERS },
    { key: 'hasRolesPermissionsViewPermission', feature: FEATURES_LOOKUP.ROLES_PERMISSIONS },
    { key: 'hasFaqViewPermission', feature: FEATURES_LOOKUP.FAQ },
    { key: 'hasRaiseSupportViewPermission', feature: FEATURES_LOOKUP.RAISE_SUPPORT },
    { key: 'hasDonationViewPermission', feature: FEATURES_LOOKUP.DONATION }
  ]

  // Generate permission variables dynamically
  const permissions = Object.fromEntries(
    featurePermissions.map(({ key, feature }) => [
      key,
      permissionUtils.hasPermission(roles, userRoles, feature, PERMISSIONS_LOOKUP.VIEW)
    ])
  )

  // Destructure generated permission variables for easy access
  const {
    hasHomeViewPermission,
    hasPublicQuizzesViewPermission,
    hasPublicGamesViewPermission,
    hasMyQuizzesViewPermission,
    hasMyGamesViewPermission,
    hasMyUtilitiesViewPermission,
    hasMyProgressViewPermission,
    hasMyProfileViewPermission,
    hasReferEarnViewPermission,
    hasReviewQuizzesViewPermission,
    hasReviewGamesViewPermission,
    hasManageAdvtViewPermission,
    hasManageQuizzesViewPermission,
    hasManageGamesViewPermission,
    hasManageEventsViewPermission,
    hasManageUsersViewPermission,
    hasRolesPermissionsViewPermission,
    hasFaqViewPermission,
    hasRaiseSupportViewPermission,
    hasDonationViewPermission
  } = permissions

  // Create composite permissions based on individual feature permissions
  const hasReviewerPagesViewPermission = hasReviewGamesViewPermission || hasReviewQuizzesViewPermission
  const hasAdminPagesViewPermission =
    hasManageAdvtViewPermission ||
    hasManageQuizzesViewPermission ||
    hasManageGamesViewPermission ||
    hasManageEventsViewPermission ||
    hasManageUsersViewPermission

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* <SubMenu
          label={dictionary['navigation'].dashboards}
          icon={<i className='ri-home-smile-line' />}
          suffix={<Chip label='1' size='small' color='error' />}
        >

        </SubMenu> */}

        <MenuSection label={dictionary['navigation'].publicPages}>
          <MenuItem href={`/${locale}/home`} icon={<i className='ri-earth-fill' />}>
            {dictionary['navigation'].quizworld}
          </MenuItem>
        </MenuSection>

        <SubMenu label={dictionary['navigation'].publicQuizzes} icon={<i className='ri-artboard-2-line' />}>
          <MenuItem href={`/${locale}/publicquiz/view`} icon={<i className='ri-artboard-2-line' />}>
            {dictionary['navigation'].view}
          </MenuItem>

          <MenuItem href={`/${locale}/publicquiz/play`} icon={<i className='ri-artboard-2-line' />}>
            {dictionary['navigation'].play}
          </MenuItem>
        </SubMenu>

        <SubMenu label={dictionary['navigation'].publicGames} icon={<SportsEsportsIcon />}>
          <MenuItem href={`/${locale}/game`} icon={<SportsEsportsIcon />}>
            {dictionary['navigation'].view}
          </MenuItem>

          <MenuItem href={`/${locale}/game/join`} icon={<SportsEsportsIcon />}>
            {dictionary['navigation'].join}
          </MenuItem>
        </SubMenu>

        <MenuSection label={dictionary['navigation'].mypages}>
          <SubMenu label={dictionary['navigation'].myquizzes} icon={<i className='ri-artboard-2-line' />}>
            <MenuItem href={`/${locale}/myquizzes/view`} icon={<i className='ri-artboard-2-line' />}>
              {dictionary['navigation'].view}
            </MenuItem>

            <MenuItem href={`/${locale}/myquizzes/create`} icon={<i className='ri-artboard-2-line' />}>
              {dictionary['navigation'].create}
            </MenuItem>

            <MenuItem href={`/${locale}/myquizzes/builder`} icon={<i className='ri-artboard-2-line' />}>
              {dictionary['navigation'].build}
            </MenuItem>

            <MenuItem href={`/${locale}/myquizzes/favorite`} icon={<i className='ri-artboard-2-line' />}>
              {dictionary['navigation'].favorite}
            </MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].game} icon={<SportsEsportsIcon />}>
            <MenuItem href={`/${locale}/mygames/view`} icon={<SportsEsportsIcon />}>
              {dictionary['navigation'].view}
            </MenuItem>
            <MenuItem href={`/${locale}/mygames/create`} icon={<SportsEsportsIcon />}>
              {dictionary['navigation'].create}
            </MenuItem>
            <MenuItem href={`/${locale}/mygames/run`} icon={<SportsEsportsIcon />}>
              {dictionary['navigation'].run}
            </MenuItem>
            <MenuItem href={`/${locale}/mygames/join`} icon={<SportsEsportsIcon />}>
              {dictionary['navigation'].join}
            </MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].myUtils} icon={<HandymanIcon />}>
            <MenuItem href={`/${locale}/myutilities/istore`} icon={<DnsIcon />}>
              {dictionary['navigation'].iStore}
            </MenuItem>
            <MenuItem href={`/${locale}/myutilities/ttrack`} icon={<PunchClockIcon />}>
              {dictionary['navigation'].tTrack}
            </MenuItem>
          </SubMenu>

          <MenuItem href={`/${locale}/dashboards/myprogress`} icon={<i className='ri-shield-star-fill' />}>
            {dictionary['navigation'].myprogress}
          </MenuItem>
          <MenuItem href={`/${locale}/pages/user-profile`} icon={<i className='ri-user-line' />}>
            {dictionary['navigation'].userProfile}
          </MenuItem>
          <MenuItem href={`/${locale}/pages/dialog-examples`} icon={<i className='ri-user-received-fill' />}>
            {dictionary['navigation'].refer}
          </MenuItem>
          {/* <SubMenu label={dictionary['navigation'].mysettings} icon={<i className='ri-earth-fill' />}>
            <MenuItem href={`/${locale}/pages/account-settings`}>{dictionary['navigation'].accountSettings}</MenuItem>
          </SubMenu> */}
        </MenuSection>

        {/* <RBACMenuWrapper roles={['REVIEWER']} session={session}> */}
        {hasReviewerPagesViewPermission && (
          <MenuSection label={dictionary['navigation'].reviewerPages}>
            {hasReviewQuizzesViewPermission && (
              <MenuItem href={`/${locale}/review/quiz`} icon=<ReviewsIcon />>
                {dictionary['navigation'].reviewQuizzes}
              </MenuItem>
            )}
            {hasReviewGamesViewPermission && (
              <MenuItem href={`/${locale}/review/game`} icon=<ReviewsIcon />>
                {dictionary['navigation'].reviewGames}
              </MenuItem>
            )}
          </MenuSection>
        )}
        {/* </RBACMenuWrapper> */}

        {hasAdminPagesViewPermission && (
          <MenuSection label={dictionary['navigation'].adminPages}>
            {hasManageAdvtViewPermission && (
              <MenuItem href={`/${locale}/apps/advertisements/list`} icon={<i className='ri-advertisement-line'></i>}>
                {dictionary['navigation'].manageAdvt}
              </MenuItem>
            )}

            {hasManageQuizzesViewPermission && (
              <SubMenu label={dictionary['navigation'].manageQuizzes} icon={<i className='ri-artboard-2-line' />}>
                <MenuItem href={`/${locale}/apps/quiz/list`}>{dictionary['navigation'].list}</MenuItem>
                {/* <MenuItem href={`/${locale}/apps/quiz/view`}>{dictionary['navigation'].view}</MenuItem> */}
              </SubMenu>
            )}
            {hasManageGamesViewPermission && (
              <SubMenu label={dictionary['navigation'].manageGames} icon={<i className='ri-artboard-2-line' />}>
                <MenuItem href={`/${locale}/apps/game/list`}>{dictionary['navigation'].list}</MenuItem>
                {/* <MenuItem href={`/${locale}/apps/quiz/view`}>{dictionary['navigation'].view}</MenuItem> */}
              </SubMenu>
            )}

            {hasManageEventsViewPermission && (
              <SubMenu label={dictionary['navigation'].manageEvents} icon={<EventOutlinedIcon />}>
                <MenuItem href={`/${locale}/apps/events/users`}>{dictionary['navigation'].users}</MenuItem>
                {/* <MenuItem href={`/${locale}/apps/quiz/view`}>{dictionary['navigation'].view}</MenuItem> */}
              </SubMenu>
            )}

            {hasManageUsersViewPermission && (
              <SubMenu label={dictionary['navigation'].manageUsers} icon={<i className='ri-user-line' />}>
                <MenuItem href={`/${locale}/apps/user/list`}>{dictionary['navigation'].list}</MenuItem>
              </SubMenu>
            )}
            {hasRolesPermissionsViewPermission && (
              <SubMenu label={dictionary['navigation'].rolesPermissions} icon={<i className='ri-lock-2-line' />}>
                <MenuItem href={`/${locale}/apps/roles`}>{dictionary['navigation'].roles}</MenuItem>
                <MenuItem href={`/${locale}/apps/features`}>{dictionary['navigation'].features}</MenuItem>
              </SubMenu>
            )}
          </MenuSection>
        )}

        <MenuSection label={dictionary['navigation'].support}>
          <MenuItem href={`/${locale}/pages/faq`} icon={<i className='ri-questionnaire-fill' />}>
            {dictionary['navigation'].faq}
          </MenuItem>

          <MenuItem
            href='https://triesoltech.com/support'
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-lifebuoy-line' />}
          >
            {dictionary['navigation'].raiseSupport}
          </MenuItem>
          <MenuItem href={`/${locale}/pages/donation`} icon={<VolunteerActivismIcon />}>
            {dictionary['navigation'].donation}
          </MenuItem>
        </MenuSection>
      </Menu>
      {/* <Menu
          popoutMenuOffset={{ mainAxis: 10 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
        </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
