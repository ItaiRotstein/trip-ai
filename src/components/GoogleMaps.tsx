"use client";

import { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

interface Place {
    name: string;
    imageUrl?: string;
    location: { lat: number; lng: number };
}

interface Props {
    places: Place[];
    coordinates: { lat: number; lng: number };
    selectedPlace: Place | null;
    setSelectedPlace: (place: Place | null) => void;
}

export default function GoogleMaps({ places, coordinates, selectedPlace, setSelectedPlace }: Props) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
    const [advancedMarkers, setAdvancedMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

    // Load Google Maps API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["marker"],
    });

    useEffect(() => {
        if (!isLoaded || !mapRef.current) return;

        // Initialize InfoWindow
        const infoWindowInstance = new google.maps.InfoWindow();
        setInfoWindow(infoWindowInstance);

        // Create Advanced Markers for each place
        const markers = places.map((place) => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: place.location,
                map: mapRef.current!,
                title: place.name,
            });

            // Click event for marker
            marker.addListener("click", () => {
                setSelectedPlace(place);
                infoWindowInstance.setContent(`
                    <div>
                        <h3 style="margin-bottom:5px;">${place.name}</h3>
                        ${place.imageUrl ? `<img src="${place.imageUrl}" style="width:100px;height:75px;border-radius:5px;margin-top:5px;" />` : ""}
                    </div>
                `);
                infoWindowInstance.open(mapRef.current, marker);
            });

            return marker;
        });

        setAdvancedMarkers(markers);

        return () => {
            markers.forEach((marker) => (marker.map = null));
        };
    }, [isLoaded, places]);

    useEffect(() => {
        if (selectedPlace && mapRef.current) {
            mapRef.current.panTo(selectedPlace.geometry.location);
            mapRef.current.setZoom(15);
        }
    }, [selectedPlace]);

    if (!isLoaded) return <p>Loading Google Maps...</p>;

    return (
        <div style={{ width: "100%", height: "500px", borderRadius: "10px", overflow: "hidden" }}>
            <GoogleMap
                onLoad={(map) => {
                    mapRef.current = map;
                    map.setZoom(12);
                }}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={coordinates}
                zoom={12}
            />
        </div>
    );
}
