
import connectMongo from '@/utils/dbConnect-mongo'
import VillageLocalityZip from '@/app/models/villagelocalityzips.model'
import States from '@/app/models/state.model'

export const getLocality = async (pinCode: string) => {
  await connectMongo();
  console.log("PinCode",pinCode)
  var query:any = {};
  query = {"PinCode":pinCode};
  console.log("query:",query)
  try {
    const Localities = await VillageLocalityZip.find(
      query
      // Filter by pinCode
    )
    return Localities
  } catch (error) {
    console.error('Error fetching pinCode: ', error)
    return null
  }
}


export const getPinCodesForState = async (stateName: string) => {
  await connectMongo();
  console.log("state",stateName)
  var query:any = {};
  query = {"StateName":stateName};
  console.log("query:",query)
  try {
    const PinCodes = await States.find(
      query
      // Filter by pinCode
    )
    return PinCodes
  } catch (error) {
    console.error('Error fetching  state pinCodes: ', error)
    return null
  }
}
