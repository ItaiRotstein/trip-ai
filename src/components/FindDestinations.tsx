"use client";

import Link from "next/link";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { Button } from "@/components/shadcn/button";

interface Destination {
    city: string;
    country: string;
    imageUrl?: string;
}

export default function FindDestinations() {
    const [weatherType, setWeatherType] = useState("");
    const [attractionType, setAttractionType] = useState(""); 
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);

    const findDestinations = async () => {
        if (!weatherType || !attractionType) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/openai-destinations?weather=${weatherType}&attraction=${attractionType}`);
            const data = await response.json();
            const places: Destination[] = data.places.map((place: { city: string; country: string }) => ({
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
    console.log("destinations from find destinations", destinations);
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">What kind of weather do you prefer?</h2>

            {/* Weather Weather Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-64">
                        {weatherType ? weatherType.charAt(0).toUpperCase() + weatherType.slice(1) : "Select Weather"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setWeatherType("tropical")}>
                        🌴 Tropical (Hot & Humid)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setWeatherType("snowy")}>
                        ❄️ Snowy (Cold & Wintery)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setWeatherType("mild")}>
                        🌤️ Mild (Cool & Pleasant)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <h2 className="text-xl font-semibold mt-4 mb-2">What are your favorite types of attractions?</h2>

            {/* Attraction Type Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-64">
                        {attractionType ? attractionType : "Select Attraction Type"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setAttractionType("cultural")}>
                        🏛️ Cultural & Historical
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAttractionType("nature")}>
                        🌿 Nature & Wildlife
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAttractionType("beaches")}>
                        🏖️ Beaches & Islands
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAttractionType("adventure")}>
                        🏔️ Adventure & Outdoor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAttractionType("food")}>
                        🍽️ Food & Culinary
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAttractionType("shopping")}>
                        🛍️ Shopping & Markets
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAttractionType("arts")}>
                        🎭 Arts & Performances
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAttractionType("relaxation")}>
                        💆‍♀️ Relaxation & Wellness
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Button */}
            <Button className="mt-4" onClick={findDestinations} disabled={!weatherType || !attractionType}>
                Find Destinations
            </Button>

            {loading && <p className="mt-4">Loading...</p>}

            {destinations.length > 0 && (
                <>
                    <h3 className="text-lg font-semibold mt-6">Recommended Destinations:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {destinations.map((place, index) => (
                            <Link
                                key={place.city + index}
                                href={`/destination/${place.city?.toLowerCase().replace(/ /g, "-")}-${place.country?.toLowerCase().replace(/ /g, "-")}`}
                                className="p-2 border rounded-lg shadow hover:bg-gray-100 transition"
                            >
                                <h4 className="text-lg font-semibold">{place.city}, {place.country}</h4>
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
