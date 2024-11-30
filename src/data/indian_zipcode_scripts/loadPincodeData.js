const fs = require('node:fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

MONGODB_URI = "mongodb+srv://pvr:bqDeVZMGHo6IwEqY@cluster0.zznmftx.mongodb.net/squizme?retryWrites=true&w=majority&appName=Cluster0"
const cached = {}
async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env.local')
  }
  if (cached.connection) {
    return cached.connection
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }
  try {
    cached.connection = await cached.promise
  } catch (e) {
    console.log(e?.message);
    cached.promise = undefined
    throw e
  }
  return cached.connection
}


// Define your schema
const indianPinCodeDataSchema = new mongoose.Schema({
  'VillageOrLocalityName': String,
  'OfficeName(BO/SO/HO)': String,
  'PinCode': String,
  'SubDistName': String,
  'DistrictName': String,
  'StateName': String
});

// Create a model based on the schema
const DataModel = mongoose.model('villageLocalityZip', indianPinCodeDataSchema);

async function main() {

  const startTime = new Date();
  console.log('Script start time:', startTime);

  try {
    // Connect to MongoDB
    await connectMongo();
    console.log('Connected to MongoDB');

    const results = [];

    // Read and parse the CSV file
    fs.createReadStream('locality_village_pincode_final_mar-2017.csv') // Replace with the path to your CSV file
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        console.log('Read Records into Buffer - Inserting Records to DB now:' + new Date());
        try {
          // Insert the parsed data into the MongoDB collection
          await DataModel.insertMany(results);
          console.log('Data loaded successfully' + new Date());
        } catch (error) {
          console.error('Error inserting data:', error);
        } finally {
          // Close the connection
          const endTime = new Date();
          console.log('Script end time:', endTime);
          mongoose.connection.close();
        }
      });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }

  const endTime = new Date();
  console.log('Script end time:', endTime);
}


async function extractAndStoreUniquePinCodes(stateName) {
  try {
    // Connect to MongoDB
    await connectMongo();
    console.log('Connected to MongoDB');

    // Query the database for documents matching the given state name
    const documents = await DataModel.find({ StateName: stateName }, 'PinCode').exec();

    // Extract unique pinCodes
    const uniquePinCodes = [...new Set(documents.map(doc => doc.PinCode))];

    // Create a document to store unique pinCodes for the state
    const pinCodeDoc = new PinCodeModel({
      StateName: stateName,
      PinCodes: uniquePinCodes
    });

    // Save the document into the separate collection
    await pinCodeDoc.save();
    console.log(`Unique pinCodes for ${stateName} stored successfully`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

async function extractUniqueStatesWithPinCodes() {
  await connectMongo();
  const session = await mongoose.startSession();

  try {
    // Connect to MongoDB
    console.log('Connected to MongoDB');   
    //session.startTransaction();

    // Query the database for unique state names
    const uniqueStateNames = await DataModel.distinct('StateName');
    console.log('Unique State Names:', uniqueStateNames);

    // Define schema for the unique state names collection
    const stateSchema = new mongoose.Schema({
      StateName: String,
      PinCodes: [String]
    });

    const StateModel = mongoose.model('State', stateSchema);
    // Prepare documents for insertion
   // Query the database for documents matching the given state name
   const documents = await DataModel.find({ StateName: 'DELHI' }, 'PinCode');
   console.log("stateName :" + 'DELHI' + " (record count): " + documents.length);

   const stateDocuments = await Promise.all(
    uniqueStateNames.map(async (stateName) => {
      console.log("StateName: " + stateName);
      // Query the database for documents matching the given state name
      const documents = await DataModel.find({ StateName: stateName }, 'PinCode');
      console.log("StateName: " + stateName + " (record count): " + documents.length);
      // Extract unique pinCodes
      const uniquePinCodes = [...new Set(documents.map(doc => doc.PinCode))];
      return { StateName: stateName, PinCodes: uniquePinCodes }
    })
  );
    // Insert the unique state names into the State collection
    console.log("State documents:"+stateDocuments.length,stateDocuments)
    await StateModel.insertMany(stateDocuments);
     // Commit the transaction
     //await session.commitTransaction();
    console.log('Unique state names with pinCodes stored successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
     // End the session
     session.endSession();
    // Close the connection
    mongoose.connection.close();
  }
}

// await main().catch(console.error);
extractUniqueStatesWithPinCodes().catch(console.error);
