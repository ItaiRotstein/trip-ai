'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

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
    const { isAuthenticated } = useAuth();

    const getAuthHeader = () => {
        const token = localStorage.getItem('token-tripai');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        // Load saved places from API when authenticated
        if (isAuthenticated) {
            fetchSavedPlaces();
        } else {
            setSavedPlaces([]);
        }
    }, [isAuthenticated]);

    const fetchSavedPlaces = async () => {
        try {
            const response = await fetch('/api/user/saved-places', {
                headers: getAuthHeader()
            });
            if (!response.ok) throw new Error('Failed to fetch saved places');
            const data = await response.json();
            setSavedPlaces(data.savedPlaces);
        } catch (error) {
            console.error('Error fetching saved places:', error);
            toast.error('Failed to load saved places');
        }
    };

    const addPlace = async (destination: Destination, place: Place) => {
        try {
            const response = await fetch('/api/user/saved-places', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ destination, place }),
            });

            if (!response.ok) throw new Error('Failed to save place');
            
            const data = await response.json();
            setSavedPlaces(data.savedPlaces);
            toast.success('Place saved successfully');
        } catch (error) {
            console.error('Error saving place:', error);
            toast.error('Failed to save place');
        }
    };

    const removePlace = async (destinationName: string, placeId: string) => {
        try {
            const response = await fetch('/api/user/saved-places', {
                method: 'DELETE',
                headers: getAuthHeader(),
                body: JSON.stringify({ destinationName, placeId }),
            });

            if (!response.ok) throw new Error('Failed to remove place');
            
            const data = await response.json();
            setSavedPlaces(data.savedPlaces);
            toast.success('Place removed successfully');
        } catch (error) {
            console.error('Error removing place:', error);
            toast.error('Failed to remove place');
        }
    };

    const clearEmptyDestinations = async () => {
        try {
            const response = await fetch('/api/user/saved-places/clear-empty-destination', {
                method: 'DELETE',
                headers: getAuthHeader(),
            });

            if (!response.ok) throw new Error('Failed to clear empty destinations');
            
            const data = await response.json();
            setSavedPlaces(data.savedPlaces);
        } catch (error) {
            console.error('Error clearing empty destinations:', error);
            toast.error('Failed to clear empty destinations');
        }
    };

    const addDestination = async (destination: Destination) => {
        try {
            const response = await fetch('/api/user/saved-places/add-destination', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ destination }),
            });

            if (!response.ok) throw new Error('Failed to add destination');
            
            const data = await response.json();
            setSavedPlaces(data.savedPlaces);
            toast.success('Destination added successfully');
        } catch (error) {
            console.error('Error adding destination:', error);
            toast.error('Failed to add destination');
        }
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