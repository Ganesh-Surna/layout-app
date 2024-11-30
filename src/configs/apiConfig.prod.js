// apiConfig.prod.js

export const API_BASE_URL = 'https://www.squizme.com/api'

export const API_URLS = {
  v0: {
    USERS_SIGNUP: `${API_BASE_URL}/users/signup`,
    USERS_SIGNIN_WITH_GOOGLE: `${API_BASE_URL}/users/google-signin`,
    USERS_LOGIN: `${API_BASE_URL}/users/login`,
    USER: `${API_BASE_URL}/user`,
    EVENT_USER: `${API_BASE_URL}/eventuser`,
    NETWORK: `${API_BASE_URL}/network`,
    FEATURE: `${API_BASE_URL}/feature`,
    ROLE: `${API_BASE_URL}/role`,
    USERS_SEND_EMAIL_OTP: `${API_BASE_URL}/email`,
    USERS_VERIFY_EMAIL_OTP: `${API_BASE_URL}/users/verifyemail`,
    USERS_SEND_PHONE_OTP: `${API_BASE_URL}/phone`,
    USERS_VERIFY_PHONE_OTP: `${API_BASE_URL}/users/verifyphone`,
    USERS_PROFILE: `${API_BASE_URL}/profile`,
    USERS_QUIZ: `${API_BASE_URL}/quiz`,
    USERS_QUIZ_QUESTION: `${API_BASE_URL}/question`,
    USERS_CONTEXT: `${API_BASE_URL}/context`,
    USERS_REFERRER_PROFILE: `${API_BASE_URL}/profile/referrer`,
    ADMIN_ADD_ADVERTISEMENT: `${API_BASE_URL}/game-advt`,
    ADMIN_DEL_ADVERTISEMENT: `${API_BASE_URL}/game-advt`,
    ADMIN_GET_ADVERTISEMENT: `${API_BASE_URL}/game-advt`,
    USERS_GAME: `${API_BASE_URL}/game`,
    USERS_GAME_LIVE: `${API_BASE_URL}/game-live`,
    REFER_EARN: `${API_BASE_URL}/refer-earn`,

    // Add more URLs for API version 1
  },
  v1: {
    USERS_SIGNUP: `${API_BASE_URL}/v1/users/signup`,
    USERS_SIGNIN_WITH_GOOGLE: `${API_BASE_URL}/v1/users/google-signin`,
    USERS_LOGIN: `${API_BASE_URL}/v1/users/login`,
    USER: `${API_BASE_URL}/v1/user`,
    EVENT_USER: `${API_BASE_URL}/v1/eventuser`,
    NETWORK: `${API_BASE_URL}/v1/network`,
    FEATURE: `${API_BASE_URL}/v1/feature`,
    ROLE: `${API_BASE_URL}/v1/role`,
    USERS_SEND_EMAIL_OTP: `${API_BASE_URL}/v1/email`,
    USERS_VERIFY_EMAIL_OTP: `${API_BASE_URL}/v1/users/verifyemail`,
    USERS_SEND_PHONE_OTP: `${API_BASE_URL}/phone`,
    USERS_VERIFY_PHONE_OTP: `${API_BASE_URL}/users/verifyphone`,
    USERS_PROFILE: `${API_BASE_URL}/v1/profile`,
    USERS_QUIZ: `${API_BASE_URL}/v1/quiz`,
    USERS_CONTEXT: `${API_BASE_URL}/v1/context`,
    USERS_QUIZ_QUESTION: `${API_BASE_URL}/v1/question`,
    USERS_REFERRER_PROFILE: `${API_BASE_URL}/v1/profile/referrer`,
    ADMIN_ADD_ADVERTISEMENT: `${API_BASE_URL}/v1/advertisements`,
    ADMIN_GET_ADVERTISEMENT: `${API_BASE_URL}/v1/advertisements`,
    USERS_GAME: `${API_BASE_URL}/v1/game`,
    USERS_GAME_LIVE: `${API_BASE_URL}/v1/game-live`,
    REFER_EARN: `${API_BASE_URL}/v1/refer-earn`,

    // Add more URLs for API version 1
  },
  v2: {
    USERS: `${API_BASE_URL}/v2/users`,
    POSTS: `${API_BASE_URL}/v2/posts`
    // Add more URLs for API version 2
  }
  // Add more API versions if needed
}
