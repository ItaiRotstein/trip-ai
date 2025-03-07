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
    const destinationNameWithoutCountry = `${formattedCity}`;

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
        throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
    }

    // Fetch destination details from the database
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/db?city=${encodeURIComponent(formattedCity)}&country=${encodeURIComponent(formattedCountry)}`);
    const destinationData = await response.json();

    if (!destinationData || destinationData.error) return notFound();

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-3xl font-bold">{formattedCountry ? destinationNameWithoutCountry : destinationName}</h1>
            <DestinationDetails selectedDestination={destinationData} />
        </div>
    );
}
