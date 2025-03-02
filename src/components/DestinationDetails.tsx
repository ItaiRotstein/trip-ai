'use client';

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shadcn/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useSavedPlaces } from '@/context/SavedPlacesContext';

interface Place {
    id: string;
    name: string;
    imageUrl: string;
    mapsEmbed: string;
    type: 'place' | 'restaurant' | 'hotel';
}

export default function DestinationDetails({ selectedDestination }: { selectedDestination: any; }) {
    const [selectedEmbedUrl, setSelectedEmbedUrl] = useState<string>(selectedDestination.destinationEmbedUrl);
    const { savedPlaces, addPlace, removePlace, addDestination } = useSavedPlaces();

    const isDestinationSaved = () => {
        const destinationName = `${selectedDestination.city}, ${selectedDestination.country}`;
        return savedPlaces.some(d => d.destinationName === destinationName);
    };

    const handleDestinationAction = () => {
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
        <section className="p-4">
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
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="places">🌍 Places to Visit</TabsTrigger>
                            <TabsTrigger value="restaurants">🍽 Restaurants</TabsTrigger>
                            <TabsTrigger value="hotels">🏨 Where to Stay</TabsTrigger>
                        </TabsList>

                        {/* Places to Visit */}
                        <TabsContent value="places">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {selectedDestination.placesToVisit.map((place: Place, index: number) => (
                                    place.imageUrl &&
                                    <div
                                        key={place.id}
                                        className="relative group"
                                    >
                                        <Card
                                            className={`cursor-pointer hover:bg-gray-100 transition 
                                                ${isPlaceSaved(place.id) ? ' border border-green-400' : ''}`}
                                            onClick={() => setSelectedEmbedUrl(place.mapsEmbed)}
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
                                                handlePlaceAction(place, 'place');
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
                        </TabsContent>

                        {/* Restaurants */}
                        <TabsContent value="restaurants">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {selectedDestination.restaurants.map((restaurant: Place, index: number) => (
                                    restaurant.imageUrl &&
                                    <div
                                        key={restaurant.id}
                                        className="relative group"
                                    >
                                        <Card
                                            className={`cursor-pointer hover:bg-gray-100 transition 
                                                ${isPlaceSaved(restaurant.id) ? ' border border-green-400' : ''}`}
                                            onClick={() => setSelectedEmbedUrl(restaurant.mapsEmbed)}
                                        >
                                            <CardHeader className="p-2">
                                                <CardTitle className="text-sm">{restaurant.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-2">
                                                <img
                                                    src={restaurant.imageUrl}
                                                    alt={restaurant.name}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                    referrerPolicy="no-referrer"
                                                />
                                            </CardContent>
                                        </Card>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlaceAction(restaurant, 'restaurant');
                                            }}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {isPlaceSaved(restaurant.id) ? (
                                                <FaCheck className="text-green-400" size={20} />
                                            ) : (
                                                <FaPlus className="text-white hover:text-green-400" size={20} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Hotels */}
                        <TabsContent value="hotels">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {selectedDestination.hotels.map((hotel: Place, index: number) => (
                                    hotel.imageUrl &&
                                    <div
                                        key={hotel.id}
                                        className="relative group"
                                    >
                                        <Card
                                            className={`cursor-pointer hover:bg-gray-100 transition 
                                                ${isPlaceSaved(hotel.id) ? ' border border-green-400' : ''}`}
                                            onClick={() => setSelectedEmbedUrl(hotel.mapsEmbed)}
                                        >
                                            <CardHeader className="p-2">
                                                <CardTitle className="text-sm">{hotel.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-2">
                                                <img
                                                    src={hotel.imageUrl}
                                                    alt={hotel.name}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                    referrerPolicy="no-referrer"
                                                />
                                            </CardContent>
                                        </Card>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlaceAction(hotel, 'hotel');
                                            }}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {isPlaceSaved(hotel.id) ? (
                                                <FaCheck className="text-green-400" size={20} />
                                            ) : (
                                                <FaPlus className="text-white hover:text-green-400" size={20} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}
