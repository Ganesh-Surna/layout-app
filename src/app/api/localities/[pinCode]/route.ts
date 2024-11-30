import { NextRequest, NextResponse } from 'next/server'
import { HttpStatusCode } from '@/utils/HttpStatusCodes'
import * as LocalitiesService from '@/app/services/locality.service';


export async function GET(_: NextRequest,
  { params }: { params: { pinCode: string } }) {
  try {
    console.log("inside get request localities/pinCode")
    const localities = await LocalitiesService.getLocality(params.pinCode)
    if (localities) {
      return NextResponse.json({ localities })
    }
    return NextResponse.json({ message: `PinCode ${params.pinCode} not found` }, { status: HttpStatusCode.NotFound })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest })
  }
}
