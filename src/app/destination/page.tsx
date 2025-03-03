import DestinationDetails from "@/components/DestinationDetails";
import { notFound } from "next/navigation";

export default async function DestinationPage({ searchParams }: { searchParams: { city?: string; country?: string; }; }) {
    const { city } = await searchParams;
    const { country } = await searchParams;

    if (!city || !country) {
        return notFound();
    }

    // Format the city and country (e.g., "tel-aviv" → "Tel Aviv")
    const formattedCity = city.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    const formattedCountry = country.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    const destinationName = `${formattedCity}, ${formattedCountry}`;

    // Fetch place details from your API, using both city & country for accuracy
    const response = await fetch(`http://localhost:3000/api/google-single-destination?city=${encodeURIComponent(formattedCity)}&country=${encodeURIComponent(formattedCountry)}`);
    const destinationData = await response.json();

    if (!destinationData || destinationData.error) return notFound();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">{destinationName}</h1>
            <DestinationDetails selectedDestination={destinationData} />
        </div>
    );
}
