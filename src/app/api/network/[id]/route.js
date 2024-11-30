import * as ApiResponseUtils from '@/utils/apiResponses'
import { getUserNetworkTree } from '@/app/services/network.service'

// GET /api/network/[id]/

export async function GET(request, { params }) {
  try {
    const email = params.id
    const profileAndNetwork = await getUserNetworkTree(email)

    if (!profileAndNetwork) {
      throw new Error(`No network found for user with email ${email}`)
    } else if (profileAndNetwork.length === 0) {
        const successResponse = ApiResponseUtils.createSuccessResponse('User has empty network.', profileAndNetwork)
        return ApiResponseUtils.sendSuccessResponse(successResponse)
    } else {
      const successResponse = ApiResponseUtils.createSuccessResponse('Succcessfully fetched user network.', profileAndNetwork)
      return ApiResponseUtils.sendSuccessResponse(successResponse)
    }
  } catch (error) {
    const errorResponse = ApiResponseUtils.createErrorResponse('Failed to fetch referrer and referrals.', error.message)
    return ApiResponseUtils.sendErrorResponse(errorResponse)
  }
}
