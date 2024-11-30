// Next Imports
import * as ApiResponseUtils from '@/utils/apiResponses'
import { changePassword } from '@/app/services/user.service'

export async function PUT(request, { params }) {
  try {
    const email = params.id
    const updateDataRequest = await request.json()

    const profile = await changePassword(email, updateDataRequest.currentPassword, updateDataRequest.newPassword)

    if (profile) {
      var successResponse = ApiResponseUtils.createSuccessResponse('Password changed successfully.', profile)
      return ApiResponseUtils.sendSuccessResponse(successResponse)
    } else {
      throw new Error('Changing password failed.')
    }
  } catch (error) {
    const errorResponse = ApiResponseUtils.createErrorResponse(error.message)
    return ApiResponseUtils.sendErrorResponse(errorResponse)
  }
}
