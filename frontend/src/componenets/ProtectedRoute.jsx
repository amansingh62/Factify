// Imported required packages
import { useEffect, useState } from "react"
import axios from "../utils/axiosInstance";
import { Navigate } from "react-router-dom";

// Function for protected routes
export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

// Logic for verifying the user
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("/auth/verify");
        console.log("Auth verification response:", res.data);
        if(res.data.success){
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        console.error("Error response:", error.response?.data);
        setAuth(false);
      }
    };

    verifyUser();
  }, []);

  if (auth === null) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          fontWeight: "500",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  return auth ? children : <Navigate to="/" replace />;
}
