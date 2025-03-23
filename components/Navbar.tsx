import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className="bg-pink-600 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">🍳 AI Recipe Generator</h1>
        <div className="flex items-center space-x-4">
          <a href="/" className="hover:text-pink-200 transition-colors">Home</a>
          <a href="/favorites" className="hover:text-pink-200 transition-colors">Favorites</a>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}