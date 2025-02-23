import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import EditJob from "./pages/EditJob";
import HelperApplications from "./pages/HelperApplications";
import HelperJobDetails from "./pages/HelperJobDetails";
import HelperJobs from "./pages/HelperJobs";
import HelperLanding from "./pages/HelperLanding";
import HelperProfile from "./pages/HelperProfile";
import HelperSavedJobs from "./pages/HelperSavedJobs";
import HelperTasks from "./pages/HelperTasks";
import JobDetails from "./pages/JobDetails";
import MainPage from "./pages/Main";
import PostJob from "./pages/PostJob";
import SeekerApplications from "./pages/SeekerApplications";
import SeekerBookings from "./pages/SeekerBookings";
import SeekerJobs from "./pages/SeekerJobs";
import SeekerLanding from "./pages/SeekerLanding";
import SeekerProfile from "./pages/SeekerProfile";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = React.useContext(AuthContext);
  console.log("ProtectedRoute - User:", user, "Loading:", loading, "Expected Role:", role);
  if (loading) return <div>Loading...</div>;
  if (!user) {
    console.log("Redirecting to /login - User not authenticated");
    return <Navigate to="/login" />;
  }
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    console.log(`Redirecting to / - Role mismatch: ${user.role} ≠ ${role}`);
    return <Navigate to="/" />;
  }
  console.log("Role check passed for:", role);
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Helper Routes - Use lowercase "helper" */}
          <Route path="/helper" element={<ProtectedRoute role="helper"><HelperLanding /></ProtectedRoute>} />
          <Route path="/helper/jobs" element={<ProtectedRoute role="helper"><HelperJobs /></ProtectedRoute>} />
          <Route path="/helper/job/:id" element={<ProtectedRoute role="helper"><HelperJobDetails /></ProtectedRoute>} />
          <Route path="/helper/applications" element={<ProtectedRoute role="helper"><HelperApplications /></ProtectedRoute>} />
          <Route path="/helper/saved-jobs" element={<ProtectedRoute role="helper"><HelperSavedJobs /></ProtectedRoute>} />
          <Route path="/helper/tasks" element={<ProtectedRoute role="helper"><HelperTasks /></ProtectedRoute>} />
          <Route path="/helper/profile" element={<ProtectedRoute role="helper"><HelperProfile /></ProtectedRoute>} />

          {/* Seeker Routes - Use lowercase "seeker" */}
          <Route path="/seeker" element={<ProtectedRoute role="seeker"><SeekerLanding /></ProtectedRoute>} />
          <Route path="/seeker/jobs" element={<ProtectedRoute role="seeker"><SeekerJobs /></ProtectedRoute>} />
          <Route path="/seeker/job/:id" element={<ProtectedRoute role="seeker"><JobDetails /></ProtectedRoute>} />
          <Route path="/seeker/applications" element={<ProtectedRoute role="seeker"><SeekerApplications /></ProtectedRoute>} />
          <Route path="/seeker/post-job" element={<ProtectedRoute role="seeker"><PostJob /></ProtectedRoute>} />
          <Route path="/seeker/profile" element={<ProtectedRoute role="seeker"><SeekerProfile /></ProtectedRoute>} />
          <Route path="/seeker/bookings" element={<ProtectedRoute role="seeker"><SeekerBookings /></ProtectedRoute>} />
          <Route path="/seeker/job/:id/edit" element={<EditJob />} />
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;