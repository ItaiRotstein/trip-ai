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

// DELETE - Clear empty destinations
export async function DELETE(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        user.savedPlaces = user.savedPlaces.filter((dest: any) => dest.places.length > 0);
        await user.save();

        return NextResponse.json({ savedPlaces: user.savedPlaces });
    } catch (error) {
        console.error('Error clearing empty destinations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 