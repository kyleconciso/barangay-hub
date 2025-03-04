// src/utils/constants.js

export const SITE_NAME = process.env.REACT_APP_SITE_NAME || "Barangay Website";
export const CONTACT_EMAIL = process.env.REACT_APP_CONTACT_EMAIL || "info@example.com";

export const DEFAULT_LOCATION = "Barangay Hall, Philippines";
export const DEFAULT_TELEPHONE = "+63 2 123 4567"; // todo: to move to site settings

// All API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        ME: "/auth/me",
    },
    PAGES: {
        GET: (slug) => `/pages/${slug}`,
    },
    NEWS: {
        GET_ALL: "/news",
        GET: (slug) => `/news/${slug}`,
    },
    REQUESTS:{
        GET_ALL: "/requests",
        GET: (id) => `/requests/${id}`,
    },
    TICKETS:{
        GET_ALL: "/tickets",
        GET: (id) => `/tickets/${id}`,
        ADD_MESSAGE: (id) => `/tickets/${id}/messages`,
    },
    USERS:{
        GET_ALL: "/users",
        GET: (id) => `/users/${id}`,
    },
    EMPLOYEES:{
        GET_ALL: "/employees",
        GET: (id) => `/employees/${id}`,
    },
    SETTINGS:{
        GET: "/settings"
    }

};

// User Roles
export const USER_ROLES = {
    USER: "user",
    EMPLOYEE: "employee",
    ADMIN: "admin",
};

// Ticket Statuses
export const TICKET_STATUSES = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  CLOSED: "closed",
}

//Ticket Categories
 export const TICKET_CATEGORIES = {
   COMPLAINT: "complaint",
   SUGGESTION: "suggestion",
   INQUIRY: "inquiry",
   OTHER: "other",
 };

export const ITEMS_PER_PAGE = 10;