// Imported all required packages
import { useState, useCallback, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { X } from "lucide-react"; 

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
      formData.append("content", content);
      if (file) formData.append("file", file);

      const res = await axios.post("/posts/create", formData, {
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
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-5 mt-5">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Create a Post</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          placeholder="What's on your mind?"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*, video/*"
          onChange={handleFileChange}
          disabled={loading}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer p-2"
        />

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
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-60"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
