// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Officials from './pages/Officials';
import NewsPage from './pages/NewsPage';
import FormsPage from './pages/FormsPage';
import SubmitTicket from './pages/SubmitTicket';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import AccountManagement from './pages/AccountManagement';
import TicketManagementPage from './pages/TicketManagementPage';
import TicketManagement from './components/Tickets/TicketManagement';
import UserManagementPage from './pages/UserManagementPage';
import ArticlePageManagementPage from './pages/ArticlePageManagementPage';
import GeneralPageManagementPage from './pages/GeneralPageManagementPage';
import FormsManagementPage from './pages/FormsManagementPage';
import SiteSettingsManagement from './pages/SiteSettingsManagement';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ChatWindow from './components/Chat/ChatWindow';
import PrivateRoute from './components/UI/PrivateRoute';
import TicketDetails from './components/Tickets/TicketDetails';
import UserDetails from './components/Users/UserDetails'; // Import UserDetails

function App() {
  return (
    <>
      <Navbar /><ChatWindow />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/officials" element={<Officials />} />
        <Route path="/news/*" element={<NewsPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/submit-ticket" element={<PrivateRoute roles={['RESIDENT', 'EMPLOYEE', 'ADMIN']} redirectTo="/sign-in"><SubmitTicket /></PrivateRoute>} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account-management" element={<PrivateRoute roles={['RESIDENT', 'EMPLOYEE', 'ADMIN']}><AccountManagement /></PrivateRoute>} />

        {/* Use nested routes and Outlet, combining all roles */}
        <Route path="/ticket-management/*" element={<PrivateRoute roles={['RESIDENT', 'EMPLOYEE', 'ADMIN']}><TicketManagementPage /></PrivateRoute>}>
            <Route index element={<TicketManagement />} /> 
            <Route path=":id" element={<TicketDetails />} />
        </Route>

        <Route path="/employee/account-management" element={<PrivateRoute roles={['EMPLOYEE', 'ADMIN']}><AccountManagement /></PrivateRoute>} />
        <Route path="/employee/user-management" element={<PrivateRoute roles={['EMPLOYEE']}><UserManagementPage /></PrivateRoute>} />
        <Route path="/employee/news-management" element={<PrivateRoute roles={['EMPLOYEE']}><ArticlePageManagementPage /></PrivateRoute>} />
        <Route path="/employee/forms-management" element={<PrivateRoute roles={['EMPLOYEE']}><FormsManagementPage /></PrivateRoute>} />

        <Route path="/admin/account-management" element={<PrivateRoute roles={['ADMIN']}><AccountManagement /></PrivateRoute>} />
        <Route path="/admin/user-management/*" element={<PrivateRoute roles={['ADMIN']}><UserManagementPage /></PrivateRoute>}>
            <Route path=":id" element={<UserDetails />} />
          </Route>
        <Route path="/admin/news-management" element={<PrivateRoute roles={['ADMIN']}><ArticlePageManagementPage /></PrivateRoute>} />
        <Route path="/admin/forms-management" element={<PrivateRoute roles={['ADMIN']}><FormsManagementPage /></PrivateRoute>} />
        <Route path="/admin/site-settings-management" element={<PrivateRoute roles={['ADMIN']}><SiteSettingsManagement /></PrivateRoute>} />
        <Route path="/admin/page-management" element={<PrivateRoute roles={['ADMIN', 'EMPLOYEE']}><GeneralPageManagementPage /></PrivateRoute>} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;