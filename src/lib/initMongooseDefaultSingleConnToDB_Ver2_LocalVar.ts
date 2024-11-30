import mongoose from 'mongoose'

const connection: { isConnected?: number } = {}
async function dbConnect() {
  if (connection.isConnected) {
    console.log('already connecterd.. returning')
    return
  }
  console.log('Connecting to dburi', process.env.MONGODB_URI)
  const db = await mongoose.connect(process.env.MONGODB_URI!)
  console.log('Database after connection..details', db.connections[0].readyState)
  connection.isConnected = db.connections[0].readyState
}

export default dbConnect
