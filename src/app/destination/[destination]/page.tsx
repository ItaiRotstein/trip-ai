import { notFound } from "next/navigation";
import DestinationDetails from "@/components/DestinationDetails";

export default async function DestinationPage({ params }: { params: { destination: string; }; }) {
    const { destination } = await params;
    const destinationName = destination
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(", ");

    // Move fetch to server component
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/google-single-destination?city=${destinationName}`);
    const placeData = await response.json();
    
    if (!placeData || placeData.error) {
        notFound();
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">{destinationName}</h1>
            <DestinationDetails placeData={placeData} />
        </div>
    );
}
