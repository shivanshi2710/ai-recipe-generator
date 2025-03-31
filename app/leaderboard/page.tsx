'use client'; // Mark this as a Client Component
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { Favorite } from '../../lib/types';

export default function Leaderboard() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        const data = await response.json();
        // Sort favorites by likes in descending order
        const sortedFavorites = data?.sort((a: Favorite, b: Favorite) => b.likes - a.likes);
        setFavorites(sortedFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-pink-800 mb-8">Leaderboard</h1>
        {isLoading ? (
          <div className="text-center">
            <div className="spinner"></div>
            <p className="text-pink-700 mt-2">Loading leaderboard...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite, index) => (
              <div key={favorite._id} className="card p-6">
                <h2 className="text-xl font-bold text-pink-800 mb-2">#{index + 1}</h2>
                <pre className="text-pink-700 whitespace-pre-wrap">{favorite.recipe}</pre>
                <p className="text-pink-700 mt-2">❤️ {favorite.likes} Likes</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-pink-700">No recipes yet. Save and like some recipes to see them here!</p>
        )}
      </div>
    </div>
  );
}