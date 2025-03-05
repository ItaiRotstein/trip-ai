import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function getUserFromToken(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    console.log('token from saved places api', token);
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== 'object') return null;

    await dbConnect();
    return User.findById(decoded.userId);
}

// GET - Fetch user's saved places
export async function GET(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ savedPlaces: user.savedPlaces || [] });
    } catch (error) {
        console.error('Error fetching saved places:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Add a new place to a destination
export async function POST(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { destination, place } = await request.json();
        const destinationName = `${destination.city}, ${destination.country}`;
        await dbConnect();

        const destinationIndex = user.savedPlaces.findIndex(
            (d: any) => d.destinationName === destinationName
        );

        if (destinationIndex === -1) {
            // Create new destination entry
            user.savedPlaces.push({
                destination,
                destinationName,
                destinationId: destination.id,
                places: [place]
            });
        } else {
            // Add to existing destination
            user.savedPlaces[destinationIndex].places.push(place);
        }

        await user.save();
        return NextResponse.json({ savedPlaces: user.savedPlaces });
    } catch (error) {
        console.error('Error adding place:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Remove a place or entire destination
export async function DELETE(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { destinationName, placeId } = await request.json();
        await dbConnect();

        if (placeId === '') {
            // Remove entire destination
            user.savedPlaces = user.savedPlaces.filter(
                (dest: any) => dest.destinationName !== destinationName
            );
        } else {
            // Remove specific place
            user.savedPlaces = user.savedPlaces.map((dest: any) => {
                if (dest.destinationName === destinationName) {
                    return {
                        ...dest,
                        places: dest.places.filter((place: any) => place.id !== placeId)
                    };
                }
                return dest;
            }).filter((dest: any) => dest.places.length > 0);
        }

        await user.save();
        return NextResponse.json({ savedPlaces: user.savedPlaces });
    } catch (error) {
        console.error('Error removing place:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 