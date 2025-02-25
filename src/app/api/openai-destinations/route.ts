import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const weatherType = searchParams.get("weather");

        if (!weatherType) {
            return NextResponse.json({ error: "Missing weather type" }, { status: 400 });
        }

        const prompt = `Give me 10 ${weatherType} travel destinations as a numbered list in this format: "City, Country". Do not include anything else.`;

        // Generate response using OpenAI SDK
        const result = await generateText({
            model: openai("gpt-3.5-turbo"),
            system: "You are a travel expert. Provide only a list of destinations with city and country names.",
            prompt,
            maxTokens: 100, // Allow a slightly longer response
        });

        // Extract the text output
        const placesText = result.text;

        // Split the response correctly by line and remove numbers
        const placesArray = placesText
            .split("\n") // Split by new lines
            .map(line => line.replace(/^\d+\.\s*/, "").trim()) // Remove numbering
            .map(place => {
                const [city, country] = place.split(",").map(s => s.trim()); // Ensure proper splitting
                return { city, country };
            });

        return NextResponse.json({ places: placesArray });
    } catch (error) {
        console.error("Error fetching OpenAI destinations:", error);
        return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
    }
}
