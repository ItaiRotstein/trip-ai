"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { Button } from "@/components/shadcn/button";

export default function DestinationSearch() {
    const searchParams = useSearchParams();
    const [weatherType, setWeatherType] = useState("");
    const [attractionType, setAttractionType] = useState("");
    const [travelGroup, setTravelGroup] = useState("");
    const router = useRouter();

    useEffect(() => {
        const weather = searchParams.get("weather");
        const attraction = searchParams.get("attraction");
        const group = searchParams.get("group");
        if (weather) setWeatherType(weather);
        if (attraction) setAttractionType(attraction);
        if (group) setTravelGroup(group);
    }, [searchParams]);

    const handleSearch = () => {
        if (!weatherType || !attractionType || !travelGroup) return;
        router.push(`/search?weather=${weatherType}&attraction=${attractionType}&group=${travelGroup}`);
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2 text-center">What kind of weather do you prefer?</h2>

            {/* Weather Dropdown */}
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

            <h2 className="text-xl font-semibold mt-4 mb-2 text-center">What are your favorite types of attractions?</h2>

            {/* Attraction Type Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-64">
                        {attractionType ? attractionType.charAt(0).toUpperCase() + attractionType.slice(1) : "Select Attraction Type"}
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

            <h2 className="text-xl font-semibold mt-4 mb-2 text-center">Who are you traveling with?</h2>

            {/* Travel Group Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-64">
                        {travelGroup ? travelGroup.replace('-', ' ').charAt(0).toUpperCase() + travelGroup.slice(1) : "Select Travel Group"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {travelGroup && (
                        <DropdownMenuItem onClick={() => setTravelGroup("")}>
                            ❌ Clear selection
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setTravelGroup("solo")}>
                        👤 Solo Travel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTravelGroup("friends")}>
                        👥 With Friends
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTravelGroup("family")}>
                        👨‍👩‍👧‍👦 Family with Children
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Button */}
            <Button 
                className="mt-8 w-64" 
                onClick={handleSearch} 
                disabled={!weatherType || !attractionType || !travelGroup}
            >
                Find Destinations
            </Button>
        </div>
    );
}
