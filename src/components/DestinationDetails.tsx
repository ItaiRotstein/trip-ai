'use client';

import { useState, Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shadcn/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useSavedPlaces } from '@/context/SavedPlacesContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

interface Place {
    id: string;
    name: string;
    imageUrl: string;
    mapsEmbed: string;
    type: 'place' | 'restaurant' | 'hotel';
}

export default function DestinationDetails({ selectedDestination }: { selectedDestination: any; }) {
    const { isAuthenticated } = useAuth();
    const [selectedEmbedUrl, setSelectedEmbedUrl] = useState<string>(selectedDestination.destinationEmbedUrl);
    const { savedPlaces, addPlace, removePlace, addDestination } = useSavedPlaces();

    const isDestinationSaved = () => {
        const destinationName = `${selectedDestination.city}, ${selectedDestination.country}`;
        return savedPlaces.some(d => d.destinationName === destinationName);
    };

    const handleDestinationAction = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to save destinations");
            return;
        }

        const destinationName = `${selectedDestination.city}, ${selectedDestination.country}`;
        if (isDestinationSaved()) {
            removePlace(destinationName, '');
        } else {
            addDestination(selectedDestination);
        }
    };

    const isPlaceSaved = (placeId: string) => {
        const destinationName = `${selectedDestination.city}, ${selectedDestination.country}`;
        const destinationPlaces = savedPlaces.find(d => d.destinationName === destinationName);
        return destinationPlaces?.places.some(place => place.id === placeId) ?? false;
    };

    const handlePlaceAction = (place: Place, type: 'place' | 'restaurant' | 'hotel') => {
        if (!isAuthenticated) {
            toast.error("Please log in to save places");
            return;
        }

        if (isPlaceSaved(place.id)) {
            const destinationName = `${selectedDestination.city}, ${selectedDestination.country}`;
            removePlace(destinationName, place.id);
        } else {
            addPlace(selectedDestination, {
                ...place,
                type
            });
        }
    };

    return (
        <section className="md:p-4">
            <div className="flex items-center gap-2 mt-4">
                <button
                    onClick={handleDestinationAction}
                    className="hover:scale-110 transition-transform"
                >
                    {isDestinationSaved() ? (
                        <FaCheck className="text-green-400" size={20} />
                    ) : (
                        <FaPlus className="text-gray-400 hover:text-green-400" size={20} />
                    )}
                </button>
                <h2 className="text-2xl font-semibold">Explore {selectedDestination.city}</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {/* Google Maps Embed Section */}
                <div className="w-full md:w-1/2">
                    <iframe
                        src={selectedEmbedUrl}
                        className="w-full h-[75vh] border-0 rounded-lg shadow-md"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* Tabs for Places to Visit, Restaurants, and Hotels */}
                <div className="w-full md:w-1/2">
                    <Tabs defaultValue="places" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="places">
                                <span className="md:hidden">🌍</span>
                                <span className="hidden md:inline">🌍 Places to Visit</span>
                            </TabsTrigger>
                            <TabsTrigger value="restaurants">
                                <span className="md:hidden">🍽</span>
                                <span className="hidden md:inline">🍽 Restaurants</span>
                            </TabsTrigger>
                            <TabsTrigger value="hotels">
                                <span className="md:hidden">🏨</span>
                                <span className="hidden md:inline">🏨 Where to Stay</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Places to Visit */}
                        <TabsContent value="places">
                            <Suspense fallback={
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                    {[...Array(6)].map((_, i) => (
                                        <PlaceCardSkeleton key={i} />
                                    ))}
                                </div>
                            }>
                                <PlaceCards
                                    places={selectedDestination.placesToVisit}
                                    onSelect={setSelectedEmbedUrl}
                                    onAction={(place) => handlePlaceAction(place, 'place')}
                                    isPlaceSaved={isPlaceSaved}
                                />
                            </Suspense>
                        </TabsContent>

                        {/* Restaurants */}
                        <TabsContent value="restaurants">
                            <Suspense fallback={
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                    {[...Array(6)].map((_, i) => (
                                        <PlaceCardSkeleton key={i} />
                                    ))}
                                </div>
                            }>
                                <PlaceCards
                                    places={selectedDestination.restaurants}
                                    onSelect={setSelectedEmbedUrl}
                                    onAction={(place) => handlePlaceAction(place, 'restaurant')}
                                    isPlaceSaved={isPlaceSaved}
                                />
                            </Suspense>
                        </TabsContent>

                        {/* Hotels */}
                        <TabsContent value="hotels">
                            <Suspense fallback={
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                    {[...Array(6)].map((_, i) => (
                                        <PlaceCardSkeleton key={i} />
                                    ))}
                                </div>
                            }>
                                <PlaceCards
                                    places={selectedDestination.hotels}
                                    onSelect={setSelectedEmbedUrl}
                                    onAction={(place) => handlePlaceAction(place, 'hotel')}
                                    isPlaceSaved={isPlaceSaved}
                                />
                            </Suspense>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}

function PlaceCardSkeleton() {
    return (
        <div className="relative">
            <div className="border rounded-lg p-2 animate-pulse">
                <div className="p-2">
                    {/* Title skeleton */}
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                </div>
                <div className="p-2">
                    {/* Image skeleton */}
                    <div className="w-full h-32 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}

function PlaceCards({ places, onSelect, onAction, isPlaceSaved }: {
    places: Place[];
    onSelect: (url: string) => void;
    onAction: (place: Place, type: 'place' | 'restaurant' | 'hotel') => void;
    isPlaceSaved: (id: string) => boolean;
}) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {places.map((place: Place) => (
                place.imageUrl &&
                <div key={place.id} className="relative group">
                    <Card
                        className={`cursor-pointer hover:bg-gray-100 transition 
                            ${isPlaceSaved(place.id) ? ' border border-green-400' : ''}`}
                        onClick={() => onSelect(place.mapsEmbed)}
                    >
                        <CardHeader className="p-2">
                            <CardTitle className="text-sm">{place.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                            <img
                                src={place.imageUrl}
                                alt={place.name}
                                className="w-full h-32 object-cover rounded-lg"
                                referrerPolicy="no-referrer"
                            />
                        </CardContent>
                    </Card>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(place, 'place');
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {isPlaceSaved(place.id) ? (
                            <FaCheck className="text-green-400" size={20} />
                        ) : (
                            <FaPlus className="text-white hover:text-green-400" size={20} />
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
}