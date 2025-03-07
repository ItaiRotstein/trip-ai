import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  placeId: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number
  },
  images: [String],
  destinationEmbedUrl: String,
  placesToVisit: [{
    name: String,
    id: String,
    parentId: String,
    parentCity: String,
    imageUrl: String,
    mapsEmbed: String
  }],
  hotels: [{
    name: String,
    id: String,
    parentId: String,
    parentCity: String,
    imageUrl: String,
    mapsEmbed: String
  }],
  restaurants: [{
    name: String,
    id: String,
    parentId: String,
    parentCity: String,
    imageUrl: String,
    mapsEmbed: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

export const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema); 