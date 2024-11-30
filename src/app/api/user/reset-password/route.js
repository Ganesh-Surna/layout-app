// Next Imports
import * as ApiResponseUtils from '@/utils/apiResponses'
import { isValidResetPasswordLink, resetPassword } from '@/app/services/user.service'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    console.log(searchParams)
    const email = searchParams.get('email')
    const token = searchParams.get('token')
    console.log(email, token)

    const result = await isValidResetPasswordLink(email, token)

    if (result.status === 'success') {
      let successResponse = ApiResponseUtils.createSuccessResponse('Reset password link is valid.', true)
      return ApiResponseUtils.sendSuccessResponse(successResponse)
    } else {
      let errorResponse = ApiResponseUtils.createErrorResponse(result.message, false)
      return ApiResponseUtils.sendErrorResponse(errorResponse)
    }
  } catch (error) {
    const errorResponse = ApiResponseUtils.createErrorResponse(error.message, false)
    return ApiResponseUtils.sendErrorResponse(errorResponse)
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url)
    console.log(searchParams)
    const email = searchParams.get('email')
    const token = searchParams.get('token')
    console.log(email, token)

    const updateDataRequest = await request.json()

    const profile = await resetPassword(email, token, updateDataRequest.password)

    if (profile) {
      var successResponse = ApiResponseUtils.createSuccessResponse('Setting password successful', profile)
      return ApiResponseUtils.sendSuccessResponse(successResponse)
    } else {
      throw new Error('Resetting password failed.')
    }
  } catch (error) {
    const errorResponse = ApiResponseUtils.createErrorResponse(error.message)
    return ApiResponseUtils.sendErrorResponse(errorResponse)
  }
}
