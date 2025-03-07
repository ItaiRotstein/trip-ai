import React from 'react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Trip AI</h1>
        
        <div className="space-y-6 text-lg text-gray-600">
          <p>
            Trip AI is designed to help you effortlessly plan your next adventure. Whether you're exploring 
            a new city, embarking on a road trip, or seeking hidden gems around the world, Trip AI provides 
            personalized recommendations, smart itineraries, and real-time travel insights to make your 
            journey seamless.
          </p>

          <p>
            With an intuitive interface and AI-powered suggestions, you can discover must-visit attractions, 
            book accommodations, find top-rated restaurants, and organize your trip—all in one place. Say 
            goodbye to hours of research and let Trip AI curate the perfect travel experience for you.
          </p>

          <p className="font-medium text-gray-900">
            Start planning smarter and travel better with Trip AI!
          </p>
        </div>
      </div>
    </main>
  );
} 