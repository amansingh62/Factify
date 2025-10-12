import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import PostCard from "../componenets/PostCard";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({ name: "", bio: "" });
    const [image, setImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const params = useParams();
    const isOwnProfile = useMemo(() => !params.username, [params.username]);

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.username]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");
            const url = isOwnProfile ? "/api/profile" : `/api/profile/${params.username}`;
            const res = await axios.get(url);
            setUser(res.data.user);
            setPosts(res.data.posts || []);
            setForm({ name: res.data.user?.name || "", bio: res.data.user?.bio || "" });
        }
        catch (e) {
            setError(e?.response?.data?.message || "Failed to load profile");
        }
        finally {
            setLoading(false);
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("bio", form.bio);
        if (image) formData.append("profilePic", image);
        try {
            const res = await axios.put("/api/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUser(res.data.user);
            setIsEditing(false);
            setImage(null);
        } catch (e) {
            alert(e?.response?.data?.message || "Failed to update profile");
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center">Loading...</div>
    }

    if (error) {
        return <div className="min-h-screen bg-black text-red-400 flex items-center justify-center">{error}</div>
    }

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm">No Photo</span>
                            )}
                        </div>
                        <div className="flex-1">
                            {isOwnProfile && isEditing ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={form.bio}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Profile Photo</label>
                                        <input type="file" accept="image/*" onChange={handleImage} className="text-sm" />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handleSave} className="px-4 py-2 bg-gray-700 rounded-xl">Save</button>
                                        <button onClick={() => { setIsEditing(false); setForm({ name: user?.name || "", bio: user?.bio || "" }); setImage(null); }} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start justify-between w-full">
                                    <div>
                                        <div className="text-xl font-semibold">{user?.name}</div>
                                        <div className="text-gray-400">@{user?.username}</div>
                                        {user?.bio && <div className="mt-2 text-gray-300">{user.bio}</div>}
                                    </div>
                                    {isOwnProfile && (
                                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl">Edit</button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 text-sm text-gray-400">Posts: {posts.length}</div>
                </div>

                <div className="mt-6">
                    {posts.length > 0 ? (
                        <PostCard posts={posts} />
                    ) : (
                        <div className="text-center text-gray-500">No posts yet.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
