import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const weatherType = searchParams.get("weather");

    if (!weatherType) {
      return NextResponse.json({ error: "Missing weather type" }, { status: 400 });
    }

    // Define temperature ranges for different weather preferences
    const weatherCriteria: Record<string, { minTemp: number; maxTemp: number }> = {
      tropical: { minTemp: 24, maxTemp: 35 }, // Hot & humid
      snowy: { minTemp: -10, maxTemp: 5 }, // Snowy places
      mild: { minTemp: 10, maxTemp: 22 } // Mild temperatures
    };

    const criteria = weatherCriteria[weatherType];

    if (!criteria) {
      return NextResponse.json({ error: "Invalid weather type" }, { status: 400 });
    }

    // Call Open-Meteo API to find places with matching temperatures
    const weatherAPI = `https://climate-api.open-meteo.com/v1/climate?latitude=40&longitude=-100&variable=temperature_2m&min_temperature=${criteria.minTemp}&max_temperature=${criteria.maxTemp}&format=json`;
    const weatherResponse = await fetch(weatherAPI);
    const weatherData = await weatherResponse.json();
    // Extract place names from the API response
    const places = weatherData.cities.map((city: any) => city.name);

    return NextResponse.json({ places });
  } catch (error) {
    console.error("Error fetching weather-based places:", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}
