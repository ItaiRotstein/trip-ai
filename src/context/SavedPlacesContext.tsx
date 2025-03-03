'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface Place {
    id: string;
    name: string;
    imageUrl: string;
    mapsEmbed: string;
    type: 'place' | 'restaurant' | 'hotel';
}

interface Destination {
    id: string;
    city: string;
    country: string;
    destinationEmbedUrl: string;
    // Add any other relevant fields from selectedDestination
}

interface DestinationPlaces {
    destination: Destination;
    destinationName: string;  // Keep for backwards compatibility
    destinationId: string;    // Keep for backwards compatibility
    places: Place[];
}

interface SavedPlacesContextType {
    savedPlaces: DestinationPlaces[];
    addPlace: (destination: Destination, place: Place) => void;
    removePlace: (destinationName: string, placeId: string) => void;
    clearEmptyDestinations: () => void;
    addDestination: (destination: Destination) => void;
}

const SavedPlacesContext = createContext<SavedPlacesContextType | undefined>(undefined);

export function SavedPlacesProvider({ children }: { children: ReactNode }) {
    const [savedPlaces, setSavedPlaces] = useState<DestinationPlaces[]>([]);

    useEffect(() => {
        // Load saved places from cookies on mount
        const savedPlacesCookie = Cookies.get('savedPlaces');
        if (savedPlacesCookie) {
            setSavedPlaces(JSON.parse(savedPlacesCookie));
        }
    }, []);

    const addPlace = (destination: Destination, place: Place) => {
        setSavedPlaces(prev => {
            const destinationName = `${destination.city}, ${destination.country}`;
            const destinationIndex = prev.findIndex(d => d.destinationName === destinationName);
            let updated;

            if (destinationIndex === -1) {
                // Create new destination entry
                updated = [...prev, { 
                    destination,
                    destinationName,
                    destinationId: destination.id,
                    places: [place] 
                }];
            } else {
                // Add to existing destination
                updated = prev.map((dest, index) => {
                    if (index === destinationIndex) {
                        return {
                            ...dest,
                            places: [...dest.places, place]
                        };
                    }
                    return dest;
                });
            }
            
            Cookies.set('savedPlaces', JSON.stringify(updated));
            return updated;
        });
    };

    const removePlace = (destinationName: string, placeId: string) => {
        setSavedPlaces(prev => {
            let updated;
            if (placeId === '') {
                // Remove entire destination
                updated = prev.filter(dest => dest.destinationName !== destinationName);
            } else {
                // Remove specific place
                updated = prev.map(dest => {
                    if (dest.destinationName === destinationName) {
                        return {
                            ...dest,
                            places: dest.places.filter(place => place.id !== placeId)
                        };
                    }
                    return dest;
                }).filter(dest => dest?.places?.length > 0); // Remove empty destinations
            }
            
            Cookies.set('savedPlaces', JSON.stringify(updated));
            return updated;
        });
    };

    const clearEmptyDestinations = () => {
        setSavedPlaces(prev => {
            const updated = prev.filter(dest => dest.places.length > 0);
            Cookies.set('savedPlaces', JSON.stringify(updated));
            return updated;
        });
    };

    const addDestination = (destination: Destination) => {
        setSavedPlaces(prev => {
            const destinationName = `${destination.city}, ${destination.country}`;
            if (prev.some(d => d.destinationName === destinationName)) {
                return prev; // Destination already exists
            }
            const updated = [...prev, { 
                destination,
                destinationName,
                destinationId: destination.id,
                places: [] 
            }];
            Cookies.set('savedPlaces', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <SavedPlacesContext.Provider value={{ 
            savedPlaces, 
            addPlace, 
            removePlace,
            clearEmptyDestinations,
            addDestination
        }}>
            {children}
        </SavedPlacesContext.Provider>
    );
}

export function useSavedPlaces() {
    const context = useContext(SavedPlacesContext);
    if (context === undefined) {
        throw new Error('useSavedPlaces must be used within a SavedPlacesProvider');
    }
    return context;
} 