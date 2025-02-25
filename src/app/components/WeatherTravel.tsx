"use client";

import { useState, useEffect } from "react";

interface Destination {
  city: string;
  country: string;
  imageUrl?: string;
}

export default function WeatherTravel() {
  const [preference, setPreference] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);

  const findDestinations = async () => {
    if (!preference) return;

    setLoading(true);
    try {
      // Fetch destinations from OpenAI API
      const response = await fetch(`/api/openai-destinations?weather=${preference}`);
      const data = await response.json();
      const places: Destination[] = data.places.map((place: { city: string; country: string }) => ({
        city: place.city,
        country: place.country,
        imageUrl: undefined, // Placeholder for images
      }));
      setDestinations(places);

      // Fetch images for each destination
      places.forEach(async (destination, index) => {
        const imageResponse = await fetch(`/api/places?city=${destination.city}`);
        const imageData = await imageResponse.json();
        if (imageData.imageUrl) {
          setDestinations(prevDestinations => {
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

  return (
    <div className="p-4">
      <h2>What kind of weather do you prefer?</h2>
      <select onChange={(e) => setPreference(e.target.value)} value={preference}>
        <option value="">Select</option>
        <option value="tropical">Tropical (Hot & Humid)</option>
        <option value="snowy">Snowy (Cold & Wintery)</option>
        <option value="mild">Mild (Cool & Pleasant)</option>
      </select>
      <button onClick={findDestinations} disabled={!preference}>
        Find Destinations
      </button>

      {loading && <p>Loading...</p>}

      {destinations.length > 0 && (
        <>
          <h3>Recommended Destinations:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map((place, index) => (
              <div key={index} className="p-2 border rounded-lg shadow">
                <h4 className="text-lg font-semibold">{place.city}, {place.country}</h4>
                {place.imageUrl ? (
                  <img src={place.imageUrl} alt={`${place.city}`} className="w-full h-40 object-cover rounded-lg mt-2" />
                ) : (
                  <p className="text-sm text-gray-500">Loading image...</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
