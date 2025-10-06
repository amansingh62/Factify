import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("/api/posts");
    setPosts(res?.data?.posts ?? []);
  };

  const handleUpvote = async (id) => {
    await axios.put(`/api/posts/${id}/upvote`);
    fetchPosts();
  };

  const handleFlag = async (id) => {
    await axios.put(`/api/posts/${id}/flag`);
    fetchPosts();
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition"
        >
          {/* Header with author */}
          {post.user?.username && (
            <div className="mb-2 text-sm text-gray-700 font-medium">
              {post.user.username}
            </div>
          )}

          {/* Text content */}
          {post.text && (
            <p className="text-gray-800 mb-3">{post.text}</p>
          )}

          {/* Media content */}
          {post.video ? (
            <video
              src={post.video}
              controls
              className="w-full rounded-lg max-h-80 object-cover"
            />
          ) : post.image ? (
            <img
              src={post.image}
              alt="post"
              className="w-full rounded-lg max-h-80 object-cover"
            />
          ) : null}

          <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
            <button
              onClick={() => handleUpvote(post._id)}
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              👍 {post.upvotes?.length ?? 0}
            </button>

            <button
              onClick={() => handleFlag(post._id)}
              className="flex items-center gap-1 hover:text-red-500 transition"
            >
              🚩 {post.flags?.length ?? 0}
            </button>

            <span>{post.comments?.length ?? 0} comments</span>
          </div>
        </div>
      ))}
    </div>
  );
}
