import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { currentUser, userProfile, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/signin" />;
  if (!userProfile?.isAdmin) return <Navigate to="/dashboard" />;
  return children;
}
