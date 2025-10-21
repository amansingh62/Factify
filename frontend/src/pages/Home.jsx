import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import CreatePost from "../componenets/CreatePost";
import PostCard from "../componenets/PostCard";
import { Bell, User, Settings } from "lucide-react";

export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();

  const handlePostCreated = () => {
    setRefresh(!refresh);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
   console.error("Logout error:", error);
    } finally {
      navigate("/");
    }
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Logo and Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-gray-800 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight truncate">
                <span className="text-gray-400 text-xs sm:text-sm font-medium tracking-wide">powered by </span>Factify
              </h1>
              <img src="/factify.png" alt="Factify Logo" className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 flex-shrink-0" />
            </div>
            
            {/* Navigation Icons */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4" ref={settingsRef}>
              {/* Notifications */}
              <button className="p-1.5 sm:p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300 relative">
                <Bell size={18} className="sm:w-5 sm:h-5" />
                {/* Notification badge */}
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full text-xs"></span>
              </button>
              
              {/* Profile */}
              <button onClick={() => navigate('/profile')} className="p-1.5 sm:p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300">
                <User size={18} className="sm:w-5 sm:h-5" />
              </button>
              
              {/* Settings menu */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings((v) => !v)}
                  className="p-1.5 sm:p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300"
                  aria-haspopup="menu"
                  aria-expanded={showSettings}
                >
                  <Settings size={18} className="sm:w-5 sm:h-5" />
                </button>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-32 sm:w-36 bg-gray-900 border border-gray-700 rounded-xl shadow-xl py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-200 hover:bg-gray-800 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 sm:pt-20 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6">
          {/* Page heading above create form */}
          <div className="flex items-center justify-center select-none">
            <div className="w-full flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <h2 className="text-center text-gray-100 font-bold tracking-wide text-lg sm:text-xl uppercase">
                Post Only Facts
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            </div>
          </div>

          <CreatePost onPostCreated={handlePostCreated} />
          <PostCard key={refresh} />
        </div>
      </div>
    </div>
  );
}
