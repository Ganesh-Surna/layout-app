import * as ApiResponseUtils from '@/utils/apiResponses'
import * as UserService from '@/app/services/user.service'
import { HttpStatusCode } from '@/utils/HttpStatusCodes'
import { getLocale } from '@/middleware'

export async function POST(request) {
  console.log('Start of api/forgot-password POST')
  try {
    // It extracts the token property from the JSON body of the incoming request.
    const reqBody = await request.json()
    const { email } = reqBody

    const locale = getLocale(request)

    const result = await UserService.srvSendResetPasswordToken(email, locale)
    if (result) {
      let resultInfo = ApiResponseUtils.createSuccessResponse('Password reset token sent successfully.')
      return ApiResponseUtils.sendSuccessResponse(resultInfo)
    }
  } catch (error) {
    let resultInfo = ApiResponseUtils.createErrorResponse(error?.message)
    return ApiResponseUtils.sendErrorResponse(resultInfo)
  }
}
