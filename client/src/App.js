// client/src/App.js
import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PublicLayout from "./components/Layouts/PublicLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import UserLayout from "./components/Layouts/UserLayout";
import HomePublic from "./pages/Public/Home";
import ArticlesPublic from "./pages/Public/Articles";
import ArticleDetailPublic from "./pages/Public/ArticleDetail";
import FormsPublic from "./pages/Public/Forms";
import FormDetailPublic from "./pages/Public/FormDetail";
import ContactPublic from "./pages/Public/Contact";
import OfficialsPublic from "./pages/Public/Officials";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import HomeAdmin from "./pages/Admin/Home";
import ArticlesAdmin from "./pages/Admin/Articles";
import PagesAdmin from "./pages/Admin/Pages";
import FormsAdmin from "./pages/Admin/Forms";
import TicketsAdmin from "./pages/Admin/Tickets";
import UsersAdmin from "./pages/Admin/Users";
import SettingsAdmin from "./pages/Admin/Settings";
import HomeUser from "./pages/User/Home";
import TicketsUser from "./pages/User/Tickets";
import TicketMessagesShared from "./pages/Shared/TicketMessages";
import { useAuth } from "./hooks/useAuth";
import ChatbotWidget from "./components/Chatbot/ChatbotWidget";
import UserProfile from "./pages/Auth/UserProfile";
import { getSettings } from "./api/settings";
import TopBar from "./components/Navigation/TopBar";
import AnnouncementBar from "./components/Navigation/AnnouncementBar";

function App() {
  const { user, userType, loading } = useAuth();
  const location = useLocation();
  const [announcementMessage, setAnnouncementMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        setAnnouncementMessage(settings.announcementText || "");
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []); // runs only once on mount

  if (loading) {
    return <div>Loading app...</div>;
  }

  // check if the current path is login or signup
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const homePageBanner =
    "https://i.ibb.co/BVxPjCrZ/475172880-122193205580173185-8945588955944178897-n.jpg"; // homepage banner url

  return (
    <>
      <AnnouncementBar announcementMessage={announcementMessage} />
      <TopBar />
      <Routes>
        {/* public routes wrapped in publiclayout conditionally */}
        <Route
          path="/"
          element={
            isAuthPage ? (
              <HomePublic />
            ) : (
              <PublicLayout bannerURL={homePageBanner} hasPadding={false}>
                <HomePublic />
              </PublicLayout>
            )
          }
        />{" "}
        {/* pass bannerurl and no padding for homepage */}
        <Route
          path="/articles"
          element={
            isAuthPage ? (
              <ArticlesPublic />
            ) : (
              <PublicLayout>
                <ArticlesPublic />
              </PublicLayout>
            )
          }
        />
        <Route
          path="/articles/:id"
          element={
            isAuthPage ? (
              <ArticleDetailPublic />
            ) : (
              <PublicLayout>
                <ArticleDetailPublic />
              </PublicLayout>
            )
          }
        />
        <Route
          path="/forms"
          element={
            isAuthPage ? (
              <FormsPublic />
            ) : (
              <PublicLayout>
                <FormsPublic />
              </PublicLayout>
            )
          }
        />
        <Route
          path="/forms/:id"
          element={
            isAuthPage ? (
              <FormDetailPublic />
            ) : (
              <PublicLayout>
                <FormDetailPublic />
              </PublicLayout>
            )
          }
        />
        <Route
          path="/contact"
          element={
            isAuthPage ? (
              <ContactPublic />
            ) : (
              <PublicLayout>
                <ContactPublic />
              </PublicLayout>
            )
          }
        />
        <Route
          path="/officials"
          element={
            isAuthPage ? (
              <OfficialsPublic />
            ) : (
              <PublicLayout>
                <OfficialsPublic />
              </PublicLayout>
            )
          }
        />
        {/* auth routes not wrapped in any layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* shared routes accessible to both user and admin/employee if authenticated */}
        <Route
          path="/tickets/:id/messages"
          element={
            user ? (
              userType === "ADMIN" || userType === "EMPLOYEE" ? (
                <AdminLayout>
                  <TicketMessagesShared />
                </AdminLayout>
              ) : (
                <UserLayout>
                  <TicketMessagesShared />
                </UserLayout>
              )
            ) : (
              <PublicLayout>
                <TicketMessagesShared />
              </PublicLayout>
            )
          }
        />
        {/* admin/employee routes wrapped in adminlayout */}
        <Route
          path="/admin"
          element={
            userType === "ADMIN" || userType === "EMPLOYEE" ? (
              <AdminLayout>
                <HomeAdmin />
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/pages"
          element={
            userType === "ADMIN" || userType === "EMPLOYEE" ? (
              <AdminLayout>
                <PagesAdmin />
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/articles"
          element={
            userType === "ADMIN" || userType === "EMPLOYEE" ? (
              <AdminLayout>
                <ArticlesAdmin />
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/forms"
          element={
            userType === "ADMIN" || userType === "EMPLOYEE" ? (
              <AdminLayout>
                <FormsAdmin />
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/tickets"
          element={
            userType === "ADMIN" || userType === "EMPLOYEE" ? (
              <AdminLayout>
                <TicketsAdmin />
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/users"
          element={
            userType === "ADMIN" || userType === "EMPLOYEE" ? (
              <AdminLayout>
                <UsersAdmin />
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/settings"
          element={
            userType === "ADMIN" ? (
              <AdminLayout>
                <SettingsAdmin />
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* user routes */}
        <Route
          path="/user"
          element={
            user ? (
              <UserLayout>
                <HomeUser />
              </UserLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/user/tickets"
          element={
            user ? (
              <UserLayout>
                <TicketsUser />
              </UserLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* user profile route */}
        <Route path="/profile" element={<UserProfile />} />
        {/* no match route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
      {!isAuthPage && <ChatbotWidget />}{" "}
      {/* conditionally render chatbotwidget */}
    </>
  );
}

export default App;
