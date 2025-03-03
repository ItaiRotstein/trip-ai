"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import DestinationSearch from "@/components/DestinationSearch";

interface Destination {
    city: string;
    country: string;
    imageUrl?: string;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const weatherType = searchParams.get("weather");
    const attractionType = searchParams.get("attraction");

    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDestinations = async () => {
            if (!weatherType || !attractionType) return;

            setLoading(true);
            try {
                const response = await fetch(`/api/openai-destinations?weather=${weatherType}&attraction=${attractionType}`);
                const data = await response.json();
                const places: Destination[] = data.places.map((place: { city: string; country: string; }) => ({
                    city: place.city,
                    country: place.country,
                    imageUrl: undefined,
                }));
                setDestinations(places);

                // Fetch images for each destination
                places.forEach(async (destination, index) => {
                    const imageResponse = await fetch(`/api/google-destinations?city=${destination.city}&country=${destination.country}`);
                    const imageData = await imageResponse.json();
                    if (imageData.imageUrl) {
                        setDestinations((prevDestinations) => {
                            const newDestinations = [...prevDestinations];
                            newDestinations[index] = { ...newDestinations[index], imageUrl: imageData.imageUrl };
                            return newDestinations;
                        });
                    }
                });
            } catch (error) {
                console.error("Error fetching destinations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, [weatherType, attractionType]);

    return (
        <div className="p-4">
            {loading && <p className="mt-4">Loading...</p>}

            {destinations.length > 0 && (
                <>
                    <h3 className="text-lg font-semibold mt-6">Recommended Destinations:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {destinations.map((place, index) => (
                            place.imageUrl &&
                            <Link
                                key={place.city + index}
                                href={`/destination/?city=${place.city.toLowerCase().replace(/ /g, "-")}&country=${place.country?.toLowerCase().replace(/ /g, "-")}`}
                                className="p-2 border rounded-lg shadow hover:bg-gray-100 transition"
                            >
                                <h4 className="text-lg font-semibold">{place.city}{place.country ? ", " : ""} {place.country}</h4>
                                {place.imageUrl ? (
                                    <img src={place.imageUrl} alt={place.city} className="w-full h-40 object-cover rounded-lg mt-2" />
                                ) : (
                                    <p className="text-sm text-gray-500">Loading image...</p>
                                )}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
} 