import mongoose from "mongoose";


export const ContextDefaultValues = {
  "id": "AUM",
  "title": "AUM",
  "lang":"en",
  "description": "Root Context",
  "owner": "system",
  "createdBy": "parsi.venkatramana@gmail.com",
  "privacy": "public",
  "parentContextId": "363636363636363636363636",
  "contextType": "COURSE",
  "tags": [],
  "status": "active",
}

const ContextSchema1_0_0 = new mongoose.Schema({
  id:{
    type: String,
    required: true,
    unique: true,
  },
  title:{
    type: String,
    required: true
  },
  lang:{
    type:String,
    required: true,
    default: 'en'
  },
  description:{
    type: String,
    required: true
  },
  createdBy:{
    type: String,
    required: true
  },
  parentContextId:{
    type: String,
    required:true
  },
  parentContextObjectId: {
   type: mongoose.Schema.Types.ObjectId, ref:'contexts', // Optional, for pre-uploaded images
    required: true,
    default:"363636363636363636363636"
  },
  contextType: {
    type: String,
    required: false,
    default:"SUBJECT"
  },
  tags: {
    type: [String],
    required:true
  },
  status: {
    type: String,
    default: 'active'
  },
  schemaVersion: {
    type: String,
    default: '1.0.0', // Initial schema version
    required: true
  }
});

const ArtifactSchemaLatest = ContextSchema1_0_0;



const Quizzes = mongoose.models.contexts || mongoose.model('contexts', ArtifactSchemaLatest);

export default Quizzes;
