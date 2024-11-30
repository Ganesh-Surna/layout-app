import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
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
        required: true,
    },
    modifiedDate: {
        type: Date,
        default: Date.now,
    },
    modifiedBy: {
        type: String,
    },
    features: {
        type: [Object],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const Role = mongoose.models.role || mongoose.model('role', roleSchema);
export default Role;
