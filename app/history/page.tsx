"use client"; // Mark this as a Client Component
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useUser } from "@clerk/nextjs";

export default function History() {
  const { user, isSignedIn } = useUser();
  const [history, setHistory] = useState<
    { recipe: string; timestamp: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (user?.id) {
          const response = await fetch(`/api/history?userId=${user?.id}`);
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-pink-800 mb-8">
          Recipe History
        </h1>
        {isLoading ? (
          <div className="text-center">
            <div className="spinner"></div>
            <p className="text-pink-700 mt-2">Loading history...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => (
              <div key={index} className="card p-6">
                <h2 className="text-xl font-bold text-pink-800 mb-2">
                  Recipe #{index + 1}
                </h2>
                <pre className="text-pink-700 whitespace-pre-wrap">
                  {item.recipe}
                </pre>
                <p className="text-pink-700 mt-2">
                  🕒 {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-pink-700">
            No history yet. Generate some recipes to see them here!
          </p>
        )}
      </div>
    </div>
  );
}
