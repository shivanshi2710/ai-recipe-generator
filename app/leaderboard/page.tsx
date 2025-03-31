'use client'; // Mark this as a Client Component
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { Favorite } from '../../lib/types';
import Markdown from 'react-markdown';
import { useUser } from "@clerk/nextjs";

export default function Leaderboard() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isSignedIn } = useUser();

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

  const handleLike = async (id: string) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      const updatedFavorites = favorites.map((favorite) =>
        favorite._id === id
          ? { ...favorite, likes: favorite.likes + 1 }
          : favorite
      );
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error liking recipe:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-pink-800 mb-8">
          🏆 Recipe Leaderboard
        </h1>
        
        {isLoading ? (
          <div className="text-center">
            <div className="spinner"></div>
            <p className="text-pink-700 mt-2">Loading leaderboard...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite, index) => (
              <div key={favorite._id} className="card p-6 flex flex-col h-[400px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-pink-500 mr-2">
                      #{index + 1}
                    </span>
                    {index < 3 && (
                      <span className="text-xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleLike(favorite._id)}
                    className="btn-pink px-3 py-1 text-sm flex items-center cursor-pointer"
                  >
                    ❤️ Like ({favorite.likes})
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto mb-4 text-pink-700">
                  <Markdown>
                    {favorite.recipe}
                  </Markdown>
                </div>

                <div className="text-sm text-pink-600 mt-auto">
                  {favorite?.userId == user?.id ? 'Your recipe' : ''}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-pink-700">
            No recipes yet. Save and like some recipes to see them here!
          </p>
        )}
      </div>
    </div>
  );
}