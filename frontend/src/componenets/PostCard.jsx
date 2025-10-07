import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Trash2 } from "lucide-react";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("/auth/verify");
      if (res.data.success) {
        setCurrentUser(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

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

  const openDeleteModal = (id) => {
    setDeleteModal({ isOpen: true, postId: id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, postId: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.postId) return;
    
    try {
      await axios.delete(`/api/posts/${deleteModal.postId}`);
      fetchPosts(); // Refresh the posts list
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition"
        >
          {/* Header with author and delete button */}
          <div className="flex justify-between items-center mb-2">
            {post.user?.username && (
              <div className="text-sm text-gray-700 font-medium">
                {post.user.username}
              </div>
            )}
            {currentUser && post.user && currentUser.id === post.user._id && (
              <button
                onClick={() => openDeleteModal(post._id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                title="Delete post"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

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
      
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Post
            </h3>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
