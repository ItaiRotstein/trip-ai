import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  id: String,
  name: String,
  imageUrl: String,
  mapsEmbed: String,
  type: {
    type: String,
    enum: ['place', 'restaurant', 'hotel']
  }
});

const DestinationSchema = new mongoose.Schema({
  destination: {
    id: String,
    city: String,
    country: String,
    destinationEmbedUrl: String
  },
  destinationName: String,
  destinationId: String,
  places: [PlaceSchema]
});

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
  savedPlaces: [DestinationSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 