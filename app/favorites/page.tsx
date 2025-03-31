"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Favorite } from "../../lib/types";
import Markdown from "react-markdown";
import { useUser } from "@clerk/nextjs";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favorites?userId=${user?.id}`);
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  const likeRecipe = async (id: string) => {
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

  const deleteFavorite = async (id: string) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      alert(data.message || data.error);

      const updatedFavorites = favorites.filter(
        (favorite) => favorite._id !== id
      );
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  const clearAllFavorites = async () => {
    try {
      if (user?.id) {
        const response = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id, clearAll: true }),
        });
        const data = await response.json();
        alert(data.message || data.error);
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error clearing favorites:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-pink-800 mb-8">Favorites</h1>
        {isLoading ? (
          <div className="text-center">
            <div className="spinner"></div>
            <p className="text-pink-700 mt-2">Loading favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <>
            <button className="btn-pink mb-8" onClick={clearAllFavorites}>
              🗑️ Clear All Favorites
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <div 
                  key={favorite._id} 
                  className="card p-6 flex flex-col"
                  style={{ height: "400px" }} // Fixed height
                >
                  <div className="overflow-y-auto flex-grow"> {/* Scrollable content */}
                    <pre className="text-pink-700 whitespace-pre-wrap">
                      <Markdown>{favorite.recipe}</Markdown>
                    </pre>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      className="btn-pink cursor-pointer"
                      onClick={() => likeRecipe(favorite._id)}
                    >
                      ❤️ Like ({favorite.likes})
                    </button>
                    <button
                      className="btn-pink cursor-pointer"
                      onClick={() => deleteFavorite(favorite._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-pink-700">
            No favorites yet. Save some recipes to see them here!
          </p>
        )}
      </div>
    </div>
  );
}