import { useState } from "react";
import CreatePost from "../componenets/CreatePost";
import PostFeed from "../componenets/PostCard";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  const handlePostCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <CreatePost onPostCreated={handlePostCreated} />
      <PostFeed key={refresh} />
    </div>
  );
}
