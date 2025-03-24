export default function Navbar() {
  return (
    <nav className="p-4 text-white shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-white animate-typing">
            🍳 Flavour Fusion
          </span>
        </h1>
        <div className="flex items-center space-x-4">
          <a href="/" className="relative group">
            <span className="hover:text-pink-200 transition-colors">Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 transition-all group-hover:w-full"></span>
          </a>
          <a href="/favorites" className="relative group">
            <span className="hover:text-pink-200 transition-colors">Favorites</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 transition-all group-hover:w-full"></span>
          </a>
          <a href="/history" className="relative group">
            <span className="hover:text-pink-200 transition-colors">History</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 transition-all group-hover:w-full"></span>
          </a>
          <a href="/leaderboard" className="relative group">
            <span className="hover:text-pink-200 transition-colors">Leaderboard</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 transition-all group-hover:w-full"></span>
          </a>
        </div>
      </div>
    </nav>
  );
}