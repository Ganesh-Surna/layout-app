import * as RestApi from '@/utils/restApiUtil'
import { API_URLS as ApiUrls } from '@/configs/apiConfig'

export async function fetchDoesUserHasPassword(email) {
  const result = await RestApi.get(`${ApiUrls.v0.USER}/${email}/does-password-exist`)
  return result
}
