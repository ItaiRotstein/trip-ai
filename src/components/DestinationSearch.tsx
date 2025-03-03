"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { Button } from "@/components/shadcn/button";

interface Destination {
    city: string;
    country: string;
    imageUrl?: string;
}

export default function DestinationSearch() {
    const searchParams = useSearchParams();
    const [weatherType, setWeatherType] = useState("");
    const [attractionType, setAttractionType] = useState(""); 
    const router = useRouter();

    useEffect(() => {
        const weather = searchParams.get("weather");
        const attraction = searchParams.get("attraction");
        if (weather) setWeatherType(weather);
        if (attraction) setAttractionType(attraction);
    }, [searchParams]);

    const handleSearch = () => {
        if (!weatherType || !attractionType) return;
        router.push(`/search?weather=${weatherType}&attraction=${attractionType}`);
    };

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
                    {weatherType && (
                        <DropdownMenuItem onClick={() => setWeatherType("")}>
                            ❌ Clear selection
                        </DropdownMenuItem>
                    )}
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
                    {attractionType && (
                        <DropdownMenuItem onClick={() => setAttractionType("")}>
                            ❌ Clear selection
                        </DropdownMenuItem>
                    )}
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
            <Button className="mt-4" onClick={handleSearch} disabled={!weatherType || !attractionType}>
                Find Destinations
            </Button>
        </div>
    );
}
