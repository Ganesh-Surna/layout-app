import mongoose from 'mongoose';

global.mongoose = {
  conn: null,
  promise: null,
};

var conString = process.env.MONGODB_URIHOST + process.env.MONGODB_DB + process.env.MONGODB_URIOPTIONS

export default async function dbConnect() {

  if (global.mongoose && global.mongoose.conn) {
    console.log('connected from previous conn');
    return global.mongoose.conn;
  }
  else {
    //const conString = process.env.MONGO_DBURI;
    const promise = mongoose.connect(conString, { autoIndex: true });
    global.mongoose = {
      conn: await promise,
      promise,
    }
    console.log('Newly connected');
    return await promise;
  }
}
