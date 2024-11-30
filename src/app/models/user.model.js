import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    index: true
  },
  phone: {
    type: String,
    index: true
    /*required: [true, "Please provide phone number"],*/
  },
  roles: {
    type: [String],
    default: ['USER']
  },
  countryCode: {
    type: String,
    index: true
  },
  password: {
    type: String
    // required: [true, 'Please provide a password']
    //select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  currentStatus: {
    type: String,
    default: 'SIGNED_UNVERIFIED'
  },
  socialLogin: {
    type: String
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  referredBy: {
    type: String,
    // required: [true, 'Please provide email'],
    unique: true,
    index: true,
    default: 'none@squizme.com'
  },
  referralToken: {
    type: String,
    unique: true,
  },
})

const User = mongoose.models?.users || mongoose.model('users', userSchema)

export default User
