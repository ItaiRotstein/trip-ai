import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function getUserFromToken(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== 'object') return null;

    await dbConnect();
    return User.findById(decoded.userId);
}

// POST - Add a new destination
export async function POST(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { destination } = await request.json();
        const destinationName = `${destination.city}, ${destination.country}`;

        // Initialize savedPlaces if it doesn't exist
        if (!user.savedPlaces) {
            user.savedPlaces = [];
        }

        // Check if destination already exists
        if (!user.savedPlaces.some((d: any) => d.destinationName === destinationName)) {
            // Create new savedPlace document
            user.savedPlaces.push({
                destination,
                destinationName,
                places: []
            });
            
            // Save the changes
            await user.save();
            
            // Fetch the updated user to ensure we have the latest data
            const updatedUser = await User.findById(user._id);
            return NextResponse.json({ savedPlaces: updatedUser?.savedPlaces });
        }

        return NextResponse.json({ savedPlaces: user.savedPlaces });
    } catch (error) {
        console.error('Error adding destination:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 