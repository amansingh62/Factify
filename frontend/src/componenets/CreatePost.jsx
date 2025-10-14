// Imported all required packages
import { useState, useCallback, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { X, Image, Video } from "lucide-react"; 

// Function for creating post
export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function for uploading media
  const handleFileChange = useCallback((e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const MAX_SIZE = 50 * 1024 * 1024;
    if (!["image/", "video/"].some(type => selected.type.startsWith(type))) {
      setError("Only images and videos are allowed");
      return;
    }
    if (selected.size > MAX_SIZE) {
      setError("File size must be below 50MB");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  }, []);

  // Function for removing the preview media
  const handleRemoveFile = () => {
  setFile(null);
  setPreview("");
};

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Function for file submit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", content);
      if (file) {
        const fieldName = file.type.startsWith('image/') ? 'image' : 'video';
        formData.append(fieldName, file);
      };

      const res = await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setContent("");
      setFile(null);
      setPreview("");
      setSuccess("Post created successfully!");
      onPostCreated?.(res.data.post);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [content, file, onPostCreated]);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl shadow-2xl border border-gray-700 p-8 relative overflow-hidden hover:border-gray-600 transition-all duration-300">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-white tracking-tight">Create a Post</h2>
        <p className="text-sm text-gray-400 mb-6">Share accurate information. Our AI will help verify it.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300 block">What's on your mind?</label>
          <textarea
            placeholder="Post only facts. Add sources if possible..."
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/40 transition-all duration-300 text-base"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex gap-3">
            <label className="cursor-pointer" aria-label="Upload image">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              <div className="flex items-center justify-center p-3 bg-gray-800 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:shadow-lg transition-all duration-300">
                <Image size={22} />
              </div>
            </label>
            <label className="cursor-pointer" aria-label="Upload video">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              <div className="flex items-center justify-center p-3 bg-gray-800 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:shadow-lg transition-all duration-300">
                <Video size={22} />
              </div>
            </label>
          </div>
        </div>

       {preview && (
  <div className="relative inline-block mt-3">
    {file?.type?.startsWith("image/") ? (
      <img
        src={preview}
        alt="Preview"
        className="w-48 h-48 object-cover rounded-xl shadow-md"
      />
    ) : (
      <video
        src={preview}
        controls
        className="w-48 h-48 object-cover rounded-xl shadow-md"
      />
    )}

    <button
      type="button"
      onClick={handleRemoveFile}
      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition"
    >
      <X size={18} />
    </button>
  </div>
)}


        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold border border-gray-700 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-400/60 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-base"
        >
          {loading ? "Poblshing..." : "Publish"}
        </button>
      </form>
      </div>
    </div>
  );
}
