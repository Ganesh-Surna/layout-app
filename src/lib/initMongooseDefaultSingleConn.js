import mongoose from 'mongoose'

const handleError = (err) => {
  console.log("Unable to connect to MongoDB", err)
}

const logError = (err) => {
  console.log("Error on Mongoose:", err)
}

if (!process.env.MONGODB_URIHOST || !process.env.MONGODB_DB) {
  throw new Error('Please add your Mongo URIHOST, DB to .env');
}

//Try to connect to mongodb...

var connStr = process.env.MONGODB_URIHOST + process.env.MONGODB_DB + process.env.MONGODB_URIOPTIONS
try {
  console.log("Initializing mongodb connection....started")
  await mongoose.connect(connStr);
  console.log("Connected to mongodb successfully");
} catch (error) {
  handleError(error);
}

//To handle errors after initial connection was established, you should listen for error events on the connection.
// However, you still need to handle initial connection errors as shown above.

mongoose.connection.on('error', err => {
  logError(err);
});

