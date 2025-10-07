import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import UniversityList from "./pages/UniversityList";
import UniversityDetail from "./pages/UniversityDetail";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import CourseComparison from "./pages/CourseComparison";
import UserFeedback from "./pages/UserFeedback";
import AdminFeedback from "./pages/AdminFeedback";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import SearchPage from "./pages/SearchPage";
import AccessDenied from "./pages/AccessDenied";
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import EditUsername from "./pages/EditUsername";
import ProfileSettings from "./pages/ProfileSettings";
import AccountSettings from "./pages/AccountSettings";
import SecuritySettings from "./pages/SecuritySettings";

const Routes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/universities" element={<UniversityList />} />
          <Route path="/universities/:id" element={<UniversityDetail />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/search" element={<SearchPage />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/compare-courses" element={<ProtectedRoute><CourseComparison /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><UserFeedback /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>}>
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="security" element={<SecuritySettings />} />
          </Route>
          <Route path="/settings/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/settings/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/settings/edit-username" element={<ProtectedRoute><EditUsername /></ProtectedRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/feedback" element={<AdminRoute><AdminFeedback /></AdminRoute>} />
          
          <Route path="/access-denied" element={<AccessDenied />} />
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
  );
};

export default Routes;
