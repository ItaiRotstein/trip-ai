"use client";

import { useState } from "react";

export default function PlacesSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/places?query=${query}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("results from places search", results);
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search places..."
      />
      <button onClick={fetchPlaces}>Search</button>

      {loading && <p>Loading...</p>}

      <ul>
        {results.map((place: any) => (
          <li key={place.place_id}>
            <strong>{place.name}</strong> - {place.formatted_address}
          </li>
        ))}
      </ul>
    </div>
  );
}
