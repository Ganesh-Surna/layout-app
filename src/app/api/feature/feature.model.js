import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        required: true,
    },
    modifiedDate: {
        type: Date,
        default: Date.now,
    },
    modifiedBy: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        // required: true,
    },
    permissions: {
        type: [String],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const Feature = mongoose.models.feature || mongoose.model('feature', featureSchema);
export default Feature;
