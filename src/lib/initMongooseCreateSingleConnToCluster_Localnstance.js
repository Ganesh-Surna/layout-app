/* stylelint-disable CssSyntaxError */
/* stylelint-disable CssSyntaxError */
import mongoose from 'mongoose'

const mongoOptions = {
  /* stylelint-disable-next-line CssSyntaxError */
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

const connect = () => 
  mongoose.createConnection(process.env.MONGODB_URIHOST ?
  process.env.MONGODB_URIHOST : "", mongoOptions);

const connectToMongoDB = () => {
  const db = connect();
  db.on('open', () => {
    console.log(`Mongoose connection open to ${JSON.stringify(process.env.MONGODB_URIHOST)}`);
  });
  db.on('error', (err) => {
    console.log(`Mongoose connection error: ${err} with connection info ${JSON.stringify(process.env.MONGODB_URL)}`);
    process.exit(0);
  });
  return db;
};

const dbConnect = connectToMongoDB();

// Export the connected instance
export { dbConnect as mongodb };
