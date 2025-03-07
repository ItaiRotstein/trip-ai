import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get('city');
        const country = searchParams.get('country');

        if (!city || !country) {
            return NextResponse.json(
                { error: "City and country parameters are required" },
                { status: 400 }
            );
        }

        await dbConnect();
        const db = mongoose.connection.db;

        const destination = await db?.collection('destinations').findOne({
            city: city,
            country: country
        });

        if (!destination) {
            return NextResponse.json(
                { error: "Destination not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(destination);

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}