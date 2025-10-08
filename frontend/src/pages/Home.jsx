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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-2xl font-bold text-white">
              <span className="text-gray-400 text-sm font-medium tracking-wide">powered by </span>Factify
            </h1>
            
            {/* Navigation Icons */}
            <div className="flex items-center gap-4" ref={settingsRef}>
              {/* Notifications */}
              <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300 relative">
                <Bell size={20} />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>
              
              {/* Profile */}
              <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300">
                <User size={20} />
              </button>
              
              {/* Settings menu */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings((v) => !v)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300"
                  aria-haspopup="menu"
                  aria-expanded={showSettings}
                >
                  <Settings size={20} />
                </button>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-36 bg-gray-900 border border-gray-700 rounded-xl shadow-xl py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-lg"
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
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <CreatePost onPostCreated={handlePostCreated} />
          <PostCard key={refresh} />
        </div>
      </div>
    </div>
  );
}
