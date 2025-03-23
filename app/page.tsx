"use client"; // Mark this as a Client Component
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Favorite } from "../lib/types";

export default function Home() {
  const [inputType, setInputType] = useState<"text" | "image">("text"); // Toggle between text and image
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const saveToFavorites = async () => {
    if (!recipe) return;

    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user-id", recipe }), // Replace 'user-id' with actual user ID from Clerk
    });
    const data = await response.json();
    alert(data.message || data.error);
  };

  const generateRecipe = async () => {
    setIsLoading(true);
    try {
      let response;
      if (inputType === "text") {
        // Generate recipe from text
        response = await fetch("/api/generate-recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients }),
        });
        const data = await response.json();
        setRecipe(data.recipe);
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipe: data.recipe }),
        });
      } else {
        // Generate recipe from image
        const reader = new FileReader();
        reader.readAsDataURL(image!);
        reader.onload = async () => {
          const base64Image = reader.result as string;

          // Remove the Base64 prefix (e.g., "data:image/png;base64,")
          const base64Data = base64Image.split(",")[1];

          // Call the API to generate recipe
          response = await fetch("/api/image-to-recipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl: `data:image/jpeg;base64,${base64Data}`,
            }),
          });

          const data = await response!.json();
          setRecipe(data.recipe);
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipe: data.recipe }),
          });
        };
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Hero Section */}

        <div className="text-center py-20 animate-fadeIn">
          <h1 className="text-5xl font-bold text-pink-800 mb-4">
            🍽️ Generate Delicious Recipes with AI
          </h1>
          <p className="text-pink-700 text-lg mb-8">
            Enter ingredients or upload an image, and let AI create a recipe for
            you!
          </p>

          {/* Toggle Between Text and Image Input */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                inputType === "text"
                  ? "bg-pink-500 text-white"
                  : "bg-pink-100 text-pink-800"
              }`}
              onClick={() => setInputType("text")}
            >
              Enter Ingredients
            </button>
            <button
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                inputType === "image"
                  ? "bg-pink-500 text-white"
                  : "bg-pink-100 text-pink-800"
              }`}
              onClick={() => setInputType("image")}
            >
              Upload Image
            </button>
          </div>

          {/* Input Section */}
          <div className="max-w-lg mx-auto">
            {inputType === "text" ? (
              <textarea
                className="w-full p-4 border-2 border-pink-300 rounded-lg mb-4 focus:outline-none focus:border-pink-500"
                placeholder="🍅 Enter ingredients (e.g., tomatoes, cheese, pasta)..."
                rows={4}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-4 border-2 border-pink-300 rounded-lg mb-4 focus:outline-none focus:border-pink-500"
              />
            )}
            <button
              className="btn-pink w-full flex items-center justify-center cursor-pointer"
              onClick={generateRecipe}
              disabled={
                isLoading ||
                (inputType === "text" && !ingredients.trim()) ||
                (inputType === "image" && !image)
              }
            >
              {isLoading ? <div className="spinner"></div> : "Generate Recipe"}
            </button>
          </div>
        </div>

        {/* Recipe Display Section */}
        {recipe && (
          <div className="card p-6 mt-12 animate-fadeIn">
            <h2 className="text-2xl font-bold text-pink-800 mb-4">
              Generated Recipe
            </h2>
            <pre className="text-pink-700 whitespace-pre-wrap">{recipe}</pre>
            <div className="flex space-x-4 mt-4">
              <button
                className="btn-pink"
                onClick={generateRecipe}
              >
                🔄 Regenerate Recipe
              </button>
              <button
                className="btn-pink"
                onClick={saveToFavorites}
              >
                💖 Save to Favorites
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
