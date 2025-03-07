import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  savedPlaces: [{
    destination: {
      type: Object,  // Or create a specific schema for destination
      required: true
    },
    destinationName: {
      type: String,
      required: true
    },
    places: [{
      type: Object,  // Or create a specific schema for places
      default: []
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 