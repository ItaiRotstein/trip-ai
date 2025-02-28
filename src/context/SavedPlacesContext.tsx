'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface Place {
    id: string;
    name: string;
    // Add other place properties as needed
}

interface SavedPlacesContextType {
    savedPlaces: Place[];
    addPlace: (place: Place) => void;
    removePlace: (placeId: string) => void;
}

const SavedPlacesContext = createContext<SavedPlacesContextType | undefined>(undefined);

export function SavedPlacesProvider({ children }: { children: ReactNode }) {
    const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
console.log("from saved places context", savedPlaces);

    useEffect(() => {
        // Load saved places from cookies on mount
        const savedPlacesCookie = Cookies.get('savedPlaces');
        if (savedPlacesCookie) {
            setSavedPlaces(JSON.parse(savedPlacesCookie));
        }
    }, []);

    const addPlace = (place: Place) => {
        setSavedPlaces(prev => {
            const updated = [...prev, place];
            Cookies.set('savedPlaces', JSON.stringify(updated));
            return updated;
        });
    };

    const removePlace = (placeId: string) => {
        setSavedPlaces(prev => {
            const updated = prev.filter(place => place.id !== placeId);
            Cookies.set('savedPlaces', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <SavedPlacesContext.Provider value={{ savedPlaces, addPlace, removePlace }}>
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