
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SITE_NAME } from '../../utils/constants';
import styles from './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Link to="/">{SITE_NAME}</Link>
      </div>
      <ul className={styles.navList}>
        <li><NavLink to="/" className={({isActive})=> isActive? styles.activeLink : ''}>Home</NavLink></li>
        <li><NavLink to="/news" className={({isActive})=> isActive? styles.activeLink : ''}>News</NavLink></li>
        <li><NavLink to="/officials" className={({isActive})=> isActive? styles.activeLink : ''}>Officials</NavLink></li>
        <li><NavLink to="/history" className={({isActive})=> isActive? styles.activeLink : ''}>History</NavLink></li>
        <li><NavLink to="/calendar" className={({isActive})=> isActive? styles.activeLink : ''}>Calendar</NavLink></li>
        <li><NavLink to="/contact" className={({isActive})=> isActive? styles.activeLink : ''}>Contact</NavLink></li>
        <li><NavLink to="/requests" className={({isActive})=> isActive? styles.activeLink : ''}>Requests</NavLink></li>

        {!user && (
          <>
            <li><NavLink to="/login" className={({isActive})=> isActive? styles.activeLink : ''}>Login</NavLink></li>
            <li><NavLink to="/register" className={({isActive})=> isActive? styles.activeLink : ''}>Register</NavLink></li>
          </>
        )}
        {user && (
          <>
           <li><NavLink to="/user/tickets" className={({isActive})=> isActive? styles.activeLink : ''}>My Tickets</NavLink></li>
            <li><NavLink to="/user/account" className={({isActive})=> isActive? styles.activeLink : ''}>Account</NavLink></li>
            <li><button onClick={handleLogout} className={styles.logoutButton}>Logout</button></li>
          </>
        )}
         {/* Employee Links */}
        {user && (user.role === 'employee' || user.role === 'admin') && (
          <>
            <li><NavLink to="/employee/news" className={({isActive})=> isActive? styles.activeLink : ''}>Manage News</NavLink></li>
            <li><NavLink to="/employee/requests" className={({isActive})=> isActive? styles.activeLink : ''}>Manage Requests</NavLink></li>
            <li><NavLink to="/employee/tickets" className={({isActive})=> isActive? styles.activeLink : ''}>Manage Tickets</NavLink></li>
            <li><NavLink to="/employee/users" className={({isActive})=> isActive? styles.activeLink : ''}>Manage Users</NavLink></li>
          </>
        )}

        {/* Admin Links */}
        {user && user.role === 'admin' && (
          <>
            <li><NavLink to="/admin/employees" className={({isActive})=> isActive? styles.activeLink : ''}>Manage Employees</NavLink></li>
            <li><NavLink to="/admin/settings" className={({isActive})=> isActive? styles.activeLink : ''}>Site Settings</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;