import { NextResponse } from 'next/server';
import  dbConnect  from "../../../../lib/initMongooseDefaultSingleConnToDB_Ver1_GlobalVar";
import { Schema } from 'mongoose';

export async function GET(request, { params }) {

  const usersSchema = new Schema({
    name: String,
    email: String,
    age: Number,
    organization: String
  });

  try {
    // Vars
    console.log("Inside Get Method of users");
    //const body = await request.json()
    console.log("Method Details...", request.method)
    const tenantId = params.tenantId;
    console.log("Tenant Details...", tenantId)

    // Call the updateUser function
    var db = await dbConnect(tenantId);
    //console.log("finding user in the db....", db)
    const Users = db.models.users || db.model('users', usersSchema);
    //const Products = mongoose.models.Products || mongoose.model<IProduct>('products', productSchema)

    var result = await Users.find()
      .then(users => {
        //console.log("found users...", users);
        return users;
      }).
      catch(err => { return new NextResponse.status(500).json({ message: err.message }) });
    // Return the updated user data as JSON
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error Fetching user:', error);
    return new NextResponse('Internal Error', { status: 500 })
  }

}
