'use client';

import { useSavedPlaces } from "@/context/SavedPlacesContext";
import { useAuth } from "@/context/AuthContext";
import { FaChevronDown, FaChevronRight, FaTimes } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import { SheetClose } from "@/components/shadcn/sheet";
import { Button } from "@/components/shadcn/button";

interface Place {
    id: string;
    name: string;
    type: string;
}

export default function SelectedPlacesDrawer() {
    const { isAuthenticated } = useAuth();
    const { savedPlaces, removePlace } = useSavedPlaces();
    const [expandedDestinations, setExpandedDestinations] = useState<string[]>([]);

    const toggleDestination = (destinationName: string) => {
        setExpandedDestinations(prev => 
            prev.includes(destinationName)
                ? prev.filter(d => d !== destinationName)
                : [...prev, destinationName]
        );
    };

    if (!isAuthenticated) {
        return (
            <div className="py-6 flex flex-col items-center justify-center space-y-4">
                <p className="text-center text-gray-600">
                    Please log in to add your favourite destinations to the list
                </p>
                <SheetClose asChild>
                    <Button asChild>
                        <Link href="/login">
                            Login
                        </Link>
                    </Button>
                </SheetClose>
            </div>
        );
    }

    const groupPlacesByType = (places: Place[]) => {
        return places.reduce((acc, place) => {
            if (!acc[place.type]) {
                acc[place.type] = [];
            }
            acc[place.type].push(place);
            return acc;
        }, {} as Record<string, Place[]>);
    };

    return (
        <div className="py-6">
            <h2 className="text-lg font-semibold mb-4">Saved Places</h2>
            <div className="space-y-4">
                {savedPlaces.length === 0 ? (
                    <p className="text-center text-gray-600">
                        No saved places yet. Start exploring destinations to save them here!
                    </p>
                ) : (
                    savedPlaces.map((destination) => (
                        <div key={destination.destinationName} className="border rounded-lg p-2">
                            <div className="flex items-center justify-between p-2">
                                <div className="flex-1">
                                    <SheetClose asChild>
                                        <Link 
                                            href={(() => {
                                                const [city, country] = destination.destinationName.split(", ");
                                                return `/destination?city=${city.toLowerCase().replace(/\s+/g, '-')}&country=${country?.toLowerCase().replace(/\s+/g, '-')}`;
                                            })()}
                                        >
                                            <span className="font-medium hover:underline">{destination.destinationName}</span>
                                        </Link>
                                    </SheetClose>
                                </div>
                                <div 
                                    className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                    onClick={() => toggleDestination(destination.destinationName)}
                                >
                                    {expandedDestinations.includes(destination.destinationName) 
                                        ? <FaChevronDown className="h-4 w-4" />
                                        : <FaChevronRight className="h-4 w-4" />
                                    }
                                </div>
                            </div>
                            
                            {expandedDestinations.includes(destination.destinationName) && (
                                <div className="pl-4 mt-2 space-y-2">
                                    {Object.entries(groupPlacesByType(destination.places)).map(([type, places]) => (
                                        <div key={type} className="space-y-1">
                                            <h3 className="text-sm font-medium text-gray-500 capitalize">
                                                {type === 'place' ? 'Places to Visit' : `${type}s`}
                                            </h3>
                                            {places.map((place: any) => (
                                                <div 
                                                    key={place.id}
                                                    className="flex items-center justify-between group hover:bg-gray-100"
                                                >
                                                    <SheetClose asChild>
                                                        <Link 
                                                            href={(() => {
                                                                const [city, country] = destination.destinationName.split(", ");
                                                                return `/destination?city=${city.toLowerCase().replace(/\s+/g, '-')}&country=${country.toLowerCase().replace(/\s+/g, '-')}`;
                                                            })()}
                                                            className="flex-1 text-sm py-1 px-2 rounded"
                                                        >
                                                            {place.name}
                                                        </Link>
                                                    </SheetClose>
                                                    <button
                                                        onClick={() => removePlace(destination.destinationName, place.id)}
                                                        className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FaTimes className="h-3 w-3 text-gray-500 hover:text-gray-900" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 