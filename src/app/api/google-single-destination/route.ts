import { NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const GOOGLE_MAPS_EMBED_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
export async function GET(req: Request) {

    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city");

        if (!city) {
            return NextResponse.json({ error: "Missing city parameter" }, { status: 400 });
        }

        // Search for the city in Google Places API
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}&key=${GOOGLE_PLACES_API_KEY}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
            return NextResponse.json({ error: "No places found" }, { status: 404 });
        }

        const place = searchData.results[0]; // Take the first result
        const placeId = place.place_id;
        const coordinates = place.geometry.location;

        // Get detailed place info
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}&fields=editorial_summary,photos,geometry,types`;
        const destinationEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_EMBED_API_KEY}&q=place_id:${placeId}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        // const description = detailsData.result?.editorial_summary?.description || "No description available.";
        const imageReferences = detailsData.result?.photos?.slice(0, 10).map((photo: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        ) || [];

        // Fetch attractions, hotels, and restaurants nearby
        const fetchNearby = async (type: string) => {
            const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=5000&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
            const response = await fetch(nearbyUrl);
            const data = await response.json();
        
            const validateImage = async (url: string) => {
                try {
                    const res = await fetch(url, { method: "HEAD" }); // ✅ Check if image is valid
                    return res.ok ? url : null; // If valid (200), return URL; otherwise, null
                } catch {
                    return null;
                }
            };
        
            return await Promise.all(
                data.results.map(async (place: any) => {
                    const imageUrl = place.photos?.[0]?.photo_reference
                        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
                        : null;
        
                    const validImage = imageUrl ? await validateImage(imageUrl) : null; // Validate image
        
                    return {
                        name: place.name,
                        id: place.place_id,
                        imageUrl: validImage || null, // ✅ Only include valid images
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

        return NextResponse.json({
            city,
            destinationEmbedUrl,
            coordinates,
            images: imageReferences,
            placesToVisit,
            hotels,
            restaurants
        });
    } catch (error) {
        console.error("Error fetching Google Places data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
