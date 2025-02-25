import { NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city");

        if (!city) {
            return NextResponse.json({ error: "Missing city parameter" }, { status: 400 });
        }

        // Search for a place matching the city name
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}&key=${GOOGLE_PLACES_API_KEY}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
            return NextResponse.json({ error: "No places found" }, { status: 404 });
        }

        const place = searchData.results[0]; // Take the first result
        const photoReference = place.photos?.[0]?.photo_reference;

        // Construct the image URL if a photo is available
        let imageUrl = null;
        if (photoReference) {
            imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
        }

        return NextResponse.json({
            city,
            imageUrl
        });
    } catch (error) {
        console.error("Error fetching Google Places image:", error);
        return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }
}
