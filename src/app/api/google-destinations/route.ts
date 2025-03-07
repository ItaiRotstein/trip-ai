import { NextResponse } from "next/server";
import { Destination } from "@/models/Destination";
import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from 'cloudinary';

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const GOOGLE_MAPS_EMBED_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(imageUrl: string) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'trip-ai',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

export async function GET(req: Request) {

    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city");
        const country = searchParams.get("country");

        if (!city) {
            return NextResponse.json({ error: "Missing city parameter" }, { status: 400 });
        }

        // Check MongoDB first
        await connectDB();
        const existingDestination = await Destination.findOne({
            city: { $regex: new RegExp(city, 'i') },
            country: country ? { $regex: new RegExp(country, 'i') } : { $exists: true }
        });

        if (existingDestination) {
            return NextResponse.json({
                city,
                imageUrl: existingDestination.images[0],
                placesToVisit: existingDestination.placesToVisit,
                hotels: existingDestination.hotels,
                restaurants: existingDestination.restaurants
            });
        }
        
        console.log("from google destinations: No existing destination found, fecthing from google");

        // If not in MongoDB, fetch from Google Places API
        const locationQuery = `${city}${country ? `, ${country}` : ''}`;
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(locationQuery)}&key=${GOOGLE_PLACES_API_KEY}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
            return NextResponse.json({ error: "No places found" }, { status: 404 });
        }

        const place = searchData.results[0];
        const destinationId = place.place_id;
        const coordinates = place.geometry.location;

        // Fetch detailed place info and nearby places
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${destinationId}&key=${GOOGLE_PLACES_API_KEY}&fields=photos,geometry,types`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        const imageReferences = detailsData.result?.photos?.slice(0, 10).map((photo: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        ) || [];

        // Upload destination images to Cloudinary
        const cloudinaryImageUrls = await Promise.all(
            imageReferences.map((imageUrl: string) => uploadToCloudinary(imageUrl))
        ).then(urls => urls.filter(url => url !== null));

        // Fetch nearby places function
        // Fetch attractions, hotels, and restaurants nearby
        const fetchNearby = async (type: string) => {
            const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=5000&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
            const response = await fetch(nearbyUrl);
            const data = await response.json();
        
            // Limit to first 10 results
            const limitedResults = data.results.slice(0, 10);
        
            return await Promise.all(
                limitedResults.map(async (place: any) => {
                    const imageUrl = place.photos?.[0]?.photo_reference
                        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
                        : null;
        
                    let cloudinaryUrl = null;
                    if (imageUrl) {
                        cloudinaryUrl = await uploadToCloudinary(imageUrl);
                    }
        
                    return {
                        name: place.name,
                        id: place.place_id,
                        parentId: destinationId,
                        parentCity: city,
                        imageUrl: cloudinaryUrl,
                        mapsEmbed: place.place_id
                            ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_EMBED_API_KEY}&q=place_id:${place.place_id}`
                            : null,
                    };
                })
            );
        };

        const [placesToVisit, hotels, restaurants] = await Promise.all([
            fetchNearby("tourist_attraction"),
            fetchNearby("lodging"),
            fetchNearby("restaurant")
        ]);

        // Save to MongoDB
        const destinationData = {
            city,
            country,
            placeId: destinationId,
            coordinates,
            images: cloudinaryImageUrls,
            destinationEmbedUrl: `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_EMBED_API_KEY}&q=place_id:${destinationId}`,
            placesToVisit,
            hotels,
            restaurants
        };

        await Destination.create(destinationData);

        return NextResponse.json({
            city,
            imageUrl: cloudinaryImageUrls[0],
            placesToVisit,
            hotels,
            restaurants
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
