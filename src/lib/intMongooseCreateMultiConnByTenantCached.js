import mongoose from 'mongoose';

global.tenantIdToConnection = {};

const mongoOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};

const connect = async (connStr) => {
  try {
    var conn = mongoose.createConnection(connStr)
    //console.log("connected...")
    return conn;
  } catch (error) {
    console.log("Error connecting..");
  }
}

export default async function dbConnect(tenantId) {
  console.log("Inside dbConnect. tenantId..............", tenantId)
  var dbName = process.env.MONGODB_DB; //default db.
  if (tenantId && tenantId.trim().length > 3) dbName = tenantId;
  var connStr = process.env.MONGODB_URIHOST + dbName + process.env.MONGODB_URIOPTIONS
  console.log("connStr(tenantId)", connStr)
  if (!global.tenantIdToConnection[tenantId]) {
    const db = await connect(connStr);
    console.log("Creating new Connection for tenant:", tenantId)
    // mongoose.connection.on('error', err => {
    //   console.log(`Mongoose connection error: ${err} with connection info ${JSON.stringify(connStr)}`);
    // });
    // mongoose.connection.on('open', err => {
    //   console.log(`Mongoose connection open to ${JSON.stringify(connStr)}`);
    // });
    db.on('open', () => {
      console.log(`Mongoose connection open to ${JSON.stringify(connStr)}`);
    });
    db.on('error', (err) => {
      console.log(`Mongoose connection error: ${err} with connection info ${JSON.stringify(connStr)}`);
    });
    global.tenantIdToConnection[tenantId] = db;
    return db;
  }
  else {
    console.log("Returning existing connection...")
    return global.tenantIdToConnection[tenantId];
  }
}




