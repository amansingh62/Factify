import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Trash2, ArrowUp, Flag, MessageSquare } from "lucide-react";

export default function PostCard() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });
  const [expandedCommentsByPost, setExpandedCommentsByPost] = useState({});
  const [commentTextByPost, setCommentTextByPost] = useState({});
  const [loading, setLoading] = useState(true);

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
    try {
      setLoading(true);
      const res = await axios.get("/api/posts");
      setPosts(res?.data?.posts ?? []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await axios.put(`/api/posts/${id}/upvote`);
      fetchPosts();
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const handleFlag = async (id) => {
    try {
      await axios.put(`/api/posts/${id}/flag`);
      fetchPosts();
    } catch (error) {
      console.error("Error flagging post:", error);
    }
  };

  const toggleComments = (id) => {
    setExpandedCommentsByPost((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddComment = async (id) => {
    const text = (commentTextByPost[id] || "").trim();
    if (!text) return;
    try {
      await axios.post(`/api/posts/${id}/comment`, { text });
      setCommentTextByPost((prev) => ({ ...prev, [id]: "" }));
      await fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">Loading posts...</div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No posts yet</div>
        <div className="text-gray-500 text-sm">Be the first to share something!</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-600 p-6 hover:shadow-xl hover:border-gray-500 transition-all duration-300 relative overflow-hidden transform hover:scale-[1.01]"
        >
          <div className="relative z-10">
            {/* Header with author and delete button */}
            <div className="flex justify-between items-center mb-4">
              {post.user?.username && (
                <div className="text-sm font-semibold text-white">
                  by {post.user.username}
                </div>
              )}
              {currentUser && post.user && currentUser.id === post.user._id && (
                <button
                  onClick={() => openDeleteModal(post._id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-900 rounded-full"
                  title="Delete post"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Text content */}
            {post.text && (
              <p className="text-gray-100 mb-4 text-base leading-relaxed">{post.text}</p>
            )}

            {/* Media content */}
            {post.video ? (
              <video
                src={post.video}
                controls
                className="w-full rounded-2xl max-h-80 object-cover mb-4"
              />
            ) : post.image ? (
              <img
                src={post.image}
                alt="post"
                className="w-full rounded-2xl max-h-80 object-cover mb-4"
              />
            ) : null}

            <div className="flex items-center gap-4 pt-4 border-t border-gray-600">
              <button
                onClick={() => handleUpvote(post._id)}
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-blue-900"
                title="Upvote"
              >
                <ArrowUp size={18} />
                <span className="font-medium">{post.upvotes?.length ?? 0}</span>
              </button>

              <button
                onClick={() => toggleComments(post._id)}
                className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors px-3 py-2 rounded-lg hover:bg-green-900"
                title="Comments"
              >
                <MessageSquare size={18} />
                <span className="font-medium">{post.comments?.length ?? 0}</span>
              </button>

              <button
                onClick={() => handleFlag(post._id)}
                className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-900"
                title="Flag"
              >
                <Flag size={18} />
                <span className="font-medium">{post.flags?.length ?? 0}</span>
              </button>
            </div>

            {expandedCommentsByPost[post._id] && (
              <div className="mt-4">
                <div className="space-y-3">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((c) => (
                      <div key={c._id || c.createdAt} className="bg-gray-700/60 border border-gray-600 rounded-xl p-3">
                        <div className="text-sm text-gray-200">
                          <span className="font-semibold">{c.user?.username ?? "Anonymous"}</span>
                        </div>
                        <div className="text-gray-300 text-sm mt-1">{c.text}</div>
                        <div className="text-gray-500 text-xs mt-1">{new Date(c.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No comments yet. Be the first to comment.</div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={commentTextByPost[post._id] || ""}
                    onChange={(e) =>
                      setCommentTextByPost((prev) => ({ ...prev, [post._id]: e.target.value }))
                    }
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-600 p-8 max-w-md w-full mx-4 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                Delete Post
              </h3>
              
              <p className="text-gray-300 mb-6 text-base">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-3 text-gray-300 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all duration-300 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline comments only; modal removed as per request */}
    </div>
  );
}
