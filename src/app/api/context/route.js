
import * as ContextService from './context.service.js'
import { HttpStatusCode } from '@/utils/HttpStatusCodes'
import * as ApiResponseUtils from '@/utils/apiResponses'
const Artifact = 'Context'
const ArtifactService = ContextService;



export async function GET(req,  { filter }) {
  try {

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const showFilter = searchParams.get("showFilter");
    var artifact = {};
    if(showFilter && showFilter==="allEvenDeleted")
      {
        artifact = await ArtifactService.getAllEvenDeleted();
      }
    else if(showFilter && showFilter==="active"){
      artifact = await ArtifactService.getActive();
    }
      else{
        artifact = await ArtifactService.getAll();
      }
    //console.log("advt: " , advt.result);
    if (artifact.status === 'success'){
      var successResponse = ApiResponseUtils.createSuccessResponse(artifact.message, artifact.result);
      return ApiResponseUtils.sendSuccessResponse(successResponse);
    }else if(artifact.status === 'error'){
      var errorResponse = ApiResponseUtils.createErrorResponse(artifact.message);
      return ApiResponseUtils.sendErrorResponse(errorResponse);
    }
  } catch (error) {
    var errorResponse = ApiResponseUtils.createErrorResponse(error.message);
    return ApiResponseUtils.sendErrorResponse(errorResponse);
  }
}


export async function POST(request) {
  //await connectMongo()

  // Defines an asynchronous POST request handler.
  try {
    const reqBody = await request.json();
    //const {userName, email, company, contact, description, imageUrl, mediaType,actionUrl, startDate, endDate, status, runType, advtCategory} = reqBody;
    //const { email, password } = reqBody
    const newArtifact = await ArtifactService.add(
      {
      ...reqBody
      }
    )
    console.log(`${Artifact}`+" Creation Step Started :", newArtifact)
    if (newArtifact.status === 'success'){
      console.log(`${Artifact}`+' Created Successfully ():');
      // Return the created advt data as JSON
      var successResponse = ApiResponseUtils.createSuccessResponse("New"+ `${Artifact}`+" created successfully", newAdd)
      return ApiResponseUtils.sendSuccessResponse(successResponse)
    } else {
      console.log(`${Artifact}`+ ' Creation error.')
      const errorResponse = ApiResponseUtils.createErrorResponse(newArtifact.message)
      return ApiResponseUtils.sendErrorResponse(errorResponse, HttpStatusCode.Ok)
    }
  } catch (error) {
    return ApiResponseUtils.sendErrorResponse(error?.message)
  }
}


export async function PUT(request) {
  //await connectMongo()
  // Defines an asynchronous POST request handler.
  try {
    const reqBody = await request.json();
    const {_id,userName, email, company, contact, mediaType, description, imageUrl, actionUrl, startDate, endDate, status, runType, advtCategory} = reqBody;
    //const { email, password } = reqBody
    const newArtifact = await ArtifactService.update(_id,
      {
        userName, email, company, contact, description,
        imageUrl,
        actionUrl,
        startDate,
        endDate,
        status,
        runType,
        mediaType,
        advtCategory
      }
    )
    console.log('`${Artifact}` Update Step 1 :', newArtifact)
    if (newArtifact.status === 'success'){
      console.log('`${Artifact}` Updated Successfully ():');
      // Return the created advt data as JSON
      var successResponse = ApiResponseUtils.createSuccessResponse(" `${Artifact}` Updated successfully", newAdd)
      return ApiResponseUtils.sendSuccessResponse(successResponse)
    } else {
      console.log('`${Artifact}` updating error.')
      const errorResponse = ApiResponseUtils.createErrorResponse(newArtifact.message)
      return ApiResponseUtils.sendErrorResponse(errorResponse, HttpStatusCode.Ok)
    }
  } catch (error) {
    return ApiResponseUtils.sendErrorResponse(error?.message)
  }
}


export async function DELETE(req) {

  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");

  if(!id){
    const errorResponse = ApiResponseUtils.createErrorResponse("Expected id of advt")
    return ApiResponseUtils.sendErrorResponse(errorResponse, HttpStatusCode.Ok);
  }

  try{
    console.log("Delete request",id)
    console.log("Received deleted request for id"+id)
    //const { email, password } = reqBody
    const deletedAd = await ArtifactService.deleteArtifact(id);
    if (deletedAd.status === 'success'){
      console.log('`${Artifact}` deleted Successfully ():');
      // Return the created advt data as JSON
      var successResponse = ApiResponseUtils.createSuccessResponse
      (" Advt deleted successfully", deletedAd)
      return ApiResponseUtils.sendSuccessResponse(successResponse)
    } else {
      console.log('`${Artifact}` deletion error.')
      const errorResponse = ApiResponseUtils.createErrorResponse(deletedAd.message)
      return ApiResponseUtils.sendErrorResponse(errorResponse, HttpStatusCode.Ok)
    }
  } catch (error) {
    var errorResponse = ApiResponseUtils.createErrorResponse(error.message)
    return ApiResponseUtils.sendErrorResponse(errorResponse)
  }
}





