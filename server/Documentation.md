
# Barangay Management System API Documentation


## Table of Contents

1.  [Introduction](#introduction)
2.  [Authentication](#authentication)
    *   [Signup](#signup)
    *   [Signin](#signin)
    *   [Get User Profile](#get-user-profile)
3.  [Chat](#chat)
    *   [Chat with Gemini](#chat-with-gemini)
4.  [Forms](#forms)
    *   [Create Form](#create-form)
    *   [Get Form by ID](#get-form-by-id)
    *   [Get All Forms](#get-all-forms)
    *   [Update Form](#update-form)
    *   [Delete Form](#delete-form)
5.  [Messages](#messages)
    *   [Create Message](#create-message)
    *   [Get Messages by Ticket ID](#get-messages-by-ticket-id)
    *   [Get Message by ID](#get-message-by-id)
    *   [Update Message](#update-message)
    *   [Delete Message](#delete-message)
6.  [Pages](#pages)
    *   [Create Page](#create-page)
    *   [Get Page by Slug](#get-page-by-slug)
    *   [Get All Pages](#get-all-pages)
    *   [Update Page](#update-page)
    *   [Delete Page](#delete-page)
7.  [Settings](#settings)
    *   [Get Settings](#get-settings)
    *   [Update Settings](#update-settings)
8.  [Tickets](#tickets)
    *   [Create Ticket](#create-ticket)
    *   [Get Ticket by ID](#get-ticket-by-id)
    *   [Get All Tickets](#get-all-tickets)
    *   [Get User Tickets](#get-user-tickets)
    *   [Update Ticket](#update-ticket)
    *   [Delete Ticket](#delete-ticket)
9.  [Users](#users)
    *   [Get User by ID](#get-user-by-id)
    *   [Get All Users](#get-all-users)
    *   [Get Residents](#get-residents)
    *   [Update User](#update-user)
    *   [Delete User](#delete-user)
10. [Error Handling](#error-handling)
11. [Roles](#roles)
12. [Response Format](#response-format)

## 1. Introduction

This API provides endpoints for managing users, forms, tickets, messages, pages, and settings within the Barangay Management System.  It utilizes Firebase Authentication for user management and Firestore as the database.

## 2. Authentication

Authentication is handled using Firebase Authentication.  Most endpoints require a valid Firebase ID token to be included in the `Authorization` header as a Bearer token.

**Authorization Header Format:**

```
Authorization: Bearer <Firebase ID Token>
```

### Signup

*   **Endpoint:** `POST /api/auth/signup`
*   **Description:** Creates a new user account in Firebase Authentication and Firestore.
*   **Auth:** None
*   **Roles:** None
*   **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "securePassword",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "123-456-7890",
      "address": "123 Main St"
    }
    ```
    *   `email` (string, required): User's email address.
    *   `password` (string, required): User's password (minimum 6 characters, enforced by Firebase).
    *   `firstName` (string, required): User's first name.
    *   `lastName` (string, required): User's last name.
    *   `phone` (string, optional): User's phone number.
    *   `address` (string, optional): User's address.

*   **Response (Success - 201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "uid": "firebaseGeneratedUserId"
      },
      "message": "User created successfully"
    }
    ```
    *   `uid`: The Firebase User ID of the newly created user.

*   **Response (Error - 400 Bad Request):** Missing required fields.
*   **Response (Error - 500 Internal Server Error):** Firebase error or database error.

### Signin

*   **Endpoint:** `POST /api/auth/signin`
*   **Description:** Authenticates an existing user using their email and password.  Returns a custom Firebase token that can be exchanged for an ID token on the client-side.
*   **Auth:** None
*   **Roles:** None
*   **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "securePassword"
    }
    ```
    *   `email` (string, required): User's email address.
    *   `password` (string, required): User's password.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "token": "firebaseCustomToken"
      },
      "message": "Sign-in successful"
    }
    ```
    * `token`: A Firebase custom token.  This token should be used by the client to obtain a Firebase ID token.

*   **Response (Error - 400 Bad Request):** Missing email or password.
*   **Response (Error - 401 Unauthorized/500 Internal Server Error):** Firebase authentication error.

### Get User Profile

*   **Endpoint:** `GET /api/auth/profile`
*   **Description:** Retrieves the profile of the currently authenticated user.
*   **Auth:** Required
*   **Roles:** None
*   **Body:** None

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "user": {
          "id": "firebaseUserId",
          "firstName": "John",
          "lastName": "Doe",
          "email": "user@example.com",
          "phone": "123-456-7890",
          "address": "123 Main St",
          "type": "RESIDENT",
          "createdAt": "2023-11-20T12:00:00.000Z",
          "createdBy": "anotherFirebaseUserId",
          "updatedAt": "2023-11-20T13:00:00.000Z",
          "updatedBy": "anotherFirebaseUserId"
        }
      },
      "message": "User profile retrieved successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):**  Missing or invalid token.
*   **Response (Error - 404 Not Found):** User not found.
*   **Response (Error - 500 Internal Server Error):**  Database error.

## 3. Chat

### Chat with Gemini

*   **Endpoint:** `POST /api/chat`
*   **Description:** Sends a message to the Gemini chatbot and returns the response. The chatbot's context is based on the last 10 news articles stored as pages.
*   **Auth:** Required
*   **Roles:** None
*   **Body:**
    ```json
    {
      "message": "What is the latest news?"
    }
    ```
    *   `message` (string, required): The user's message to the chatbot.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "response": "The latest news is..."
      },
      "message": "Chat response generated successfully"
    }
    ```
    *   `response`: The Gemini chatbot's response.

*   **Response (Error - 400 Bad Request):**  Missing `message`.
*   **Response (Error - 401 Unauthorized):**  Missing or invalid token.
*   **Response (Error - 500 Internal Server Error):**  Error communicating with Gemini API, missing Gemini API key, or database error.

## 4. Forms

### Create Form

*   **Endpoint:** `POST /api/forms`
*   **Description:** Creates a new form.
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Body:**
    ```json
    {
      "title": "Community Survey",
      "description": "Please fill out this survey...",
      "link": "https://example.com/survey",
      "logoURL": "https://example.com/logo.png"
    }
    ```
    *   `title` (string, required): The title of the form.
    *   `description` (string, required): A description of the form.
    *   `link` (string, required, URL):  A link to the form (e.g., a Google Form link).
    *   `logoURL` (string, optional, URL): A URL to an image for the form's logo.

*   **Response (Success - 201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "id": "firestoreDocumentId"
      },
      "message": "Form created successfully"
    }
    ```
    *   `id`: The Firestore document ID of the newly created form.

*   **Response (Error - 400 Bad Request):**  Missing required fields, invalid URL.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):**  User does not have the required role.
*   **Response (Error - 500 Internal Server Error):**  Database error.

### Get Form by ID

*   **Endpoint:** `GET /api/forms/:id`
*   **Description:** Retrieves a form by its ID.
*   **Auth:** None
*   **Roles:** None
*   **Params:**
    *   `id` (string, required): The Firestore document ID of the form.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "form": {
          "id": "firestoreDocumentId",
          "title": "Community Survey",
          "description": "Please fill out this survey...",
          "link": "https://example.com/survey",
          "logoURL": "https://example.com/logo.png",
          "createdAt": "2023-11-20T14:00:00.000Z",
          "createdBy": "firebaseUserId",
          "updatedAt": "2023-11-20T14:00:00.000Z",
          "updatedBy": "firebaseUserId"
        }
      },
      "message": "Form retrieved successfully"
    }
    ```

*   **Response (Error - 404 Not Found):** Form not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get All Forms

*   **Endpoint:** `GET /api/forms`
*   **Description:** Retrieves all forms.
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Body:** None

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "forms": [
          {
            "id": "firestoreDocumentId1",
            "title": "Form 1",
            "description": "...",
            "link": "...",
            "logoURL": "...",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          },
          {
            "id": "firestoreDocumentId2",
            "title": "Form 2",
            "description": "...",
            "link": "...",
            "logoURL": "...",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          }
        ]
      },
      "message": "Forms retrieved successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Update Form

*   **Endpoint:** `PUT /api/forms/:id`
*   **Description:** Updates an existing form.
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Params:**
    *   `id` (string, required): The Firestore document ID of the form.
*   **Body:**
    ```json
    {
      "title": "Updated Form Title",
      "description": "Updated description...",
      "link": "https://example.com/updated-survey",
      "logoURL": "https://example.com/updated-logo.png"
    }
    ```
    *   All fields are optional.  Only provide the fields you want to update.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "Form updated successfully"
    }
    ```

*   **Response (Error - 400 Bad Request):** Invalid URL.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 404 Not Found):** Form not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Delete Form

*   **Endpoint:** `DELETE /api/forms/:id`
*   **Description:** Deletes a form.
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Params:**
    *   `id` (string, required): The Firestore document ID of the form.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "Form deleted successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 404 Not Found):** Form not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

## 5. Messages

### Create Message

*   **Endpoint:** `POST /api/messages`
*   **Description:** Creates a new message associated with a ticket.
*   **Auth:** Required
*   **Roles:** None
*   **Body:**
    ```json
    {
      "ticketId": "firestoreTicketId",
      "content": "This is a new message."
    }
    ```
    *   `ticketId` (string, required): The Firestore document ID of the ticket the message belongs to.
    *   `content` (string, required): The content of the message.

*   **Response (Success - 201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "id": "firestoreMessageId"
      },
      "message": "Message created successfully"
    }
    ```
    *   `id`: The Firestore document ID of the newly created message.

*   **Response (Error - 400 Bad Request):** Missing required fields.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User is not the creator of the ticket and is not an `EMPLOYEE` or `ADMIN`.
*   **Response (Error - 404 Not Found):** Ticket not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get Messages by Ticket ID

*   **Endpoint:** `GET /api/messages/ticket/:ticketId`
*   **Description:** Retrieves all messages associated with a specific ticket.
*   **Auth:** Required
*   **Roles:** None
*   **Params:**
    *   `ticketId` (string, required): The Firestore document ID of the ticket.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "messages": [
          {
            "id": "firestoreMessageId1",
            "ticket": "firestoreTicketId",
            "content": "Message 1",
            "createdBy": "firebaseUserId1",
            "createdAt": "2023-11-20T15:00:00.000Z"
          },
          {
            "id": "firestoreMessageId2",
            "ticket": "firestoreTicketId",
            "content": "Message 2",
            "createdBy": "firebaseUserId2",
            "createdAt": "2023-11-20T15:05:00.000Z"
          }
        ]
      },
      "message": "Messages retrieved successfully"
    }
    ```
*   Messages are ordered by `createdAt` (ascending).

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):**  User is not the creator of the ticket and is not an `EMPLOYEE` or `ADMIN`.
*   **Response (Error - 404 Not Found):**  Ticket not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get Message by ID

*   **Endpoint:** `GET /api/messages/:id`
*   **Description:** Retrieves a specific message by its ID.
*   **Auth:** Required
*   **Roles:** None
*   **Params:**
    *   `id` (string, required): The Firestore document ID of the message.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "message": {
          "id": "firestoreMessageId",
          "ticket": "firestoreTicketId",
          "content": "The message content",
          "createdBy": "firebaseUserId",
          "createdAt": "2023-11-20T15:00:00.000Z"
        }
      },
      "message": "Message retrieved successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
    *   **Response (Error - 403 Forbidden):**  User is not the creator of the ticket associated to this message, and is not an `EMPLOYEE` or `ADMIN`.
*   **Response (Error - 404 Not Found):** Message not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Update Message

*   **Endpoint:** `PUT /api/messages/:id`
*   **Description:** Updates a specific message.
*   **Auth:** Required
*   **Roles:** None
*   **Params:**
    *   `id` (string, required): The Firestore document ID of the message.
*   **Body:**
    ```json
    {
      "content": "Updated message content."
    }
    ```
    *   `content` (string, required): The updated content of the message.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "Message updated successfully"
    }
    ```

*   **Response (Error - 400 Bad Request):**  Missing `content`.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):**  User is not the creator of the ticket associated to this message, and is not an `EMPLOYEE` or `ADMIN`.
*   **Response (Error - 404 Not Found):** Message not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Delete Message

*   **Endpoint:** `DELETE /api/messages/:id`
*   **Description:** Deletes a specific message.
*   **Auth:** Required
*   **Roles:** None
*   **Params:**
    *   `id` (string, required): The Firestore document ID of the message.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "Message deleted successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):**  User is not the creator of the ticket associated with the message and is not an `ADMIN`.
*   **Response (Error - 404 Not Found):** Message not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

## 6. Pages

### Create Page

*   **Endpoint:** `POST /api/pages`
*   **Description:** Creates a new page.
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Body:**
    ```json
    {
      "slug": "about-us",
      "title": "About Us",
      "content": "This is the about us page content."
    }
    ```
    *   `slug` (string, required):  A unique URL slug for the page (e.g., "about-us").
    *   `title` (string, required): The title of the page.
    *   `content` (string, required): The content of the page (can be HTML or plain text).

*   **Response (Success - 201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "id": "firestorePageId"
      },
      "message": "Page created successfully"
    }
    ```
    *    `id`: The Firestore document ID of the newly created page.

*   **Response (Error - 400 Bad Request):** Missing required fields.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get Page by Slug

*   **Endpoint:** `GET /api/pages/:slug`
*   **Description:** Retrieves a page by its slug.
*   **Auth:** None
*   **Roles:** None
*   **Params:**
    *   `slug` (string, required): The slug of the page.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "page": {
          "id": "firestorePageId",
          "slug": "about-us",
          "title": "About Us",
          "content": "This is the about us page content.",
          "createdAt": "2023-11-20T16:00:00.000Z",
          "createdBy": "firebaseUserId",
          "updatedAt": "2023-11-20T16:00:00.000Z",
          "updatedBy": "firebaseUserId"
        }
      },
      "message": "Page retrieved successfully"
    }
    ```

*   **Response (Error - 404 Not Found):** Page not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get All Pages

*   **Endpoint:** `GET /api/pages`
*   **Description:** Retrieves all pages.
*   **Auth:** None
*   **Roles:** None
*   **Body:** None

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "pages": [
          {
            "id": "firestorePageId1",
            "slug": "page-1",
            "title": "Page 1",
            "content": "...",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          },
          {
            "id": "firestorePageId2",
            "slug": "page-2",
            "title": "Page 2",
            "content": "...",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          }
        ]
      },
      "message": "Pages retrieved successfully"
    }
    ```

*   **Response (Error - 500 Internal Server Error):** Database error.

### Update Page

*   **Endpoint:** `PUT /api/pages/:slug`
*   **Description:** Updates an existing page.
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Params:**
    *   `slug` (string, required): The slug of the page.
*   **Body:**
    ```json
    {
      "title": "Updated Page Title",
      "content": "Updated page content."
    }
    ```
    *   `title` (string, optional): The updated title of the page.
    *   `content` (string, optional): The updated content of the page.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "Page updated successfully"
    }
    ```

*   **Response (Error - 400 Bad Request):**  Invalid input.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):**  User does not have required role.
*   **Response (Error - 404 Not Found):** Page not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Delete Page

*   **Endpoint:** `DELETE /api/pages/:slug`
*   **Description:** Deletes a page.
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Params:**
    *   `slug` (string, required): The slug of the page.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "Page deleted successfully"
    }
    ```
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 404 Not Found):** Page not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

## 7. Settings

### Get Settings

*   **Endpoint:** `GET /api/settings`
*   **Description:** Retrieves the application settings.
*   **Auth:** Required
*   **Roles:** `ADMIN`
*   **Body:** None

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "settings": {
          "googleGeminiKey": "your-gemini-api-key",
          "facebookPageId": "your-facebook-page-id",
          "facebookAccessToken": "your-facebook-access-token"
        }
      },
      "message": "Settings retrieved successfully"
    }
    ```
*   If no settings exist, an empty object `{}` is returned for `"settings"`.

*   **Response (Error - 401 Unauthorized):**  Missing or invalid token.
*   **Response (Error - 403 Forbidden):**  User does not have required role.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Update Settings

*   **Endpoint:** `PUT /api/settings`
*   **Description:** Updates the application settings.
*   **Auth:** Required
*   **Roles:** `ADMIN`
*   **Body:**
    ```json
    {
      "googleGeminiKey": "new-gemini-api-key",
      "facebookPageId": "new-facebook-page-id",
      "facebookAccessToken": "new-facebook-access-token"
    }
    ```
*   **Only** the `googleGeminiKey`, `facebookPageId`, and `facebookAccessToken` fields can be updated.  Any other fields in the request body will result in a 400 Bad Request error.  You should send all three values even if you are only updating one.
*   The entire settings object is replaced.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "Settings updated successfully"
    }
    ```

*   **Response (Error - 400 Bad Request):** Invalid setting key provided.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 500 Internal Server Error):** Database error.

## 8. Tickets

### Create Ticket

*   **Endpoint:** `POST /api/tickets`
*   **Description:** Creates a new ticket.
*   **Auth:** Required
*   **Roles:** None
*   **Body:**
    ```json
    {
      "title": "My Issue",
      "type": "Complaint"
    }
    ```
    *   `title` (string, required): The title of the ticket.
    *   `type` (string, required): The type of the ticket (e.g., "Complaint", "Request", "Inquiry").

*   **Response (Success - 201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "id": "firestoreTicketId"
      },
      "message": "Ticket created successfully"
    }
    ```
    *    `id`: The Firestore document ID of the newly created ticket.

*   **Response (Error - 400 Bad Request):** Missing required fields.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get Ticket by ID

*   **Endpoint:** `GET /api/tickets/:id`
*   **Description:** Retrieves a ticket by its ID.
*   **Auth:** Required
*   **Roles:** None
*   **Params:**
    *   `id` (string, required): The Firestore document ID of the ticket.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "ticket": {
          "id": "firestoreTicketId",
          "title": "My Issue",
          "type": "Complaint",
          "status": "OPEN",
          "assignedTo": null,
          "createdAt": "2023-11-20T17:00:00.000Z",
          "createdBy": "firebaseUserId",
          "updatedAt": "2023-11-20T17:00:00.000Z",
          "updatedBy": "firebaseUserId"
        }
      },
      "message": "Ticket retrieved successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User is not the ticket creator, and is not an `EMPLOYEE` or `ADMIN`.
*   **Response (Error - 404 Not Found):** Ticket not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get All Tickets

*   **Endpoint:** `GET /api/tickets`
*   **Description:** Retrieves all tickets.
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Body:** None

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "tickets": [
          {
            "id": "firestoreTicketId1",
            "title": "Ticket 1",
            "type": "...",
            "status": "...",
            "assignedTo": "...",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          },
          {
            "id": "firestoreTicketId2",
            "title": "Ticket 2",
            "type": "...",
            "status": "...",
            "assignedTo": "...",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          }
        ]
      },
      "message": "Tickets retrieved successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get User Tickets

*   **Endpoint:** `GET /api/tickets/my/all`
*   **Description:** Retrieves all tickets created by the currently authenticated user.
*   **Auth:** Required
*   **Roles:** None
*   **Body:** None

*   *   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "tickets": [
          {
            "id": "firestoreTicketId1",
            "title": "Ticket 1",
            "type": "...",
            "status": "...",
            "assignedTo": "...",
            "createdAt": "...",
            "createdBy": "currentUserFirebaseId",
            "updatedAt": "...",
            "updatedBy": "..."
          },
          {
            "id": "firestoreTicketId2",
            "title": "Ticket 2",
            "type": "...",
            "status": "...",
            "assignedTo": "...",
            "createdAt": "...",
            "createdBy": "currentUserFirebaseId",
            "updatedAt": "...",
            "updatedBy": "..."
          }
        ]
      },
      "message": "Tickets retrieved successfully"
    }
    ```
* The `createdBy` field will always match the currently authenticated user's Firebase ID.

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Update Ticket

*   **Endpoint:** `PUT /api/tickets/:id`
*   **Description:** Updates an existing ticket.
*   **Auth:** Required
*   **Roles:** None
*   **Params:**
    *   `id` (string, required): The Firestore document ID of the ticket.
*   **Body:**
    ```json
    {
      "title": "Updated Ticket Title",
      "type": "Request",
      "status": "IN_PROGRESS",
      "assignedTo": "anotherFirebaseUserId"
    }
    ```
    *   `title` (string, optional): The updated title of the ticket.
    *   `type` (string, optional): The updated type of the ticket.
    *   `status` (string, optional): The updated status of the ticket.  Must be one of: `"OPEN"`, `"IN_PROGRESS"`, `"CLOSED"`.
    *   `assignedTo` (string, optional): The Firebase User ID of the user the ticket is assigned to.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "Ticket updated successfully"
    }
    ```

*   **Response (Error - 400 Bad Request):** Invalid `status` value.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User is not the ticket creator and is not an `EMPLOYEE` or `ADMIN`.
*   **Response (Error - 404 Not Found):** Ticket not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Delete Ticket

*   **Endpoint:** `DELETE /api/tickets/:id`
*   **Description:** Deletes a ticket.
*   **Auth:** Required
*   **Roles:** None
*   **Params:**
    *   `id` (string, required): The Firestore document ID of the ticket.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "Ticket deleted successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User is not the ticket creator and is not an `ADMIN`.
*   **Response (Error - 404 Not Found):** Ticket not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

## 9. Users

### Get User by ID

*   **Endpoint:** `GET /api/users/:id`
*   **Description:** Retrieves a user by their ID.
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Params:**
    *   `id` (string, required): The Firebase User ID of the user.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "user": {
          "id": "firebaseUserId",
          "firstName": "John",
          "lastName": "Doe",
          "email": "user@example.com",
          "phone": "123-456-7890",
          "address": "123 Main St",
          "type": "RESIDENT",
          "createdAt": "2023-11-20T12:00:00.000Z",
          "createdBy": "anotherFirebaseUserId",
          "updatedAt": "2023-11-20T13:00:00.000Z",
          "updatedBy": "anotherFirebaseUserId"
        }
      },
      "message": "User retrieved successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 404 Not Found):** User not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get All Users

*   **Endpoint:** `GET /api/users`
*   **Description:** Retrieves all users.
*   **Auth:** Required
*   **Roles:** `ADMIN`
*   **Body:** None

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "users": [
          {
            "id": "firebaseUserId1",
            "firstName": "...",
            "lastName": "...",
            "email": "...",
            "phone": "...",
            "address": "...",
            "type": "...",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          },
          {
            "id": "firebaseUserId2",
            "firstName": "...",
            "lastName": "...",
            "email": "...",
            "phone": "...",
            "address": "...",
            "type": "...",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          }
        ]
      },
      "message": "Users retrieved successfully"
    }
    ```
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Get Residents

*   **Endpoint:** `GET /api/users/type/resident`
*   **Description:** Retrieves all users with the type "RESIDENT".
*   **Auth:** Required
*   **Roles:** `EMPLOYEE`, `ADMIN`
*   **Body:** None

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "residents": [
          {
             "id": "firebaseUserId1",
            "firstName": "...",
            "lastName": "...",
            "email": "...",
            "phone": "...",
            "address": "...",
            "type": "RESIDENT",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          },
           {
            "id": "firebaseUserId2",
            "firstName": "...",
            "lastName": "...",
            "email": "...",
            "phone": "...",
            "address": "...",
            "type": "RESIDENT",
            "createdAt": "...",
            "createdBy": "...",
            "updatedAt": "...",
            "updatedBy": "..."
          }
        ]
      },
      "message": "Residents retrieved successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Update User

*   **Endpoint:** `PUT /api/users/:id`
*   **Description:** Updates an existing user.  Only admins can update users.
*   **Auth:** Required
*   **Roles:** `ADMIN`
*   **Params:**
    *   `id` (string, required): The Firebase User ID of the user to update.
*   **Body:**
    ```json
    {
      "firstName": "UpdatedFirstName",
      "lastName": "UpdatedLastName",
      "phone": "987-654-3210",
      "address": "456 New St",
      "type": "EMPLOYEE"
    }
    ```
    *   `firstName` (string, optional): The updated first name.
    *   `lastName` (string, optional): The updated last name.
    *   `phone` (string, optional): The updated phone number.
    *   `address` (string, optional): The updated address.
    *   `type` (string, optional): The updated user type. Must be one of: `"RESIDENT"`, `"EMPLOYEE"`, `"ADMIN"`.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "User updated successfully"
    }
    ```

*   **Response (Error - 400 Bad Request):** Invalid `type` value.
*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 404 Not Found):** User not found.
*   **Response (Error - 500 Internal Server Error):** Database error.

### Delete User

*   **Endpoint:** `DELETE /api/users/:id`
*   **Description:** Deletes a user.  Only admins can delete users. Deletes both the Firebase Authentication user and the Firestore document.
*   **Auth:** Required
*   **Roles:** `ADMIN`
*   **Params:**
    *   `id` (string, required): The Firebase User ID of the user to delete.

*   **Response (Success - 200 OK):**
    ```json
    {
      "success": true,
      "data": null,
      "message": "User deleted successfully"
    }
    ```

*   **Response (Error - 401 Unauthorized):** Missing or invalid token.
*   **Response (Error - 403 Forbidden):** User does not have required role.
*   **Response (Error - 404 Not Found):** User not found in Firebase Authentication or Firestore.
*   **Response (Error - 500 Internal Server Error):** Database error or Firebase Authentication error.

## 10. Error Handling

The API uses a consistent error handling approach.  Errors are returned in the following format:

```json
{
  "success": false,
  "data": null,
  "message": "Error message describing the problem"
}
```

The `message` field provides a human-readable description of the error. The HTTP status code indicates the type of error:

*   **400 Bad Request:**  The request was malformed or missing required parameters.
*   **401 Unauthorized:**  The request was not authenticated, or the provided token was invalid or expired.
*   **403 Forbidden:**  The authenticated user does not have permission to access the requested resource.
*   **404 Not Found:**  The requested resource was not found.
*   **500 Internal Server Error:**  An unexpected error occurred on the server.

## 11. Roles

The API uses role-based access control.  The following roles are defined:

*   **RESIDENT:**  A regular user of the system.
*   **EMPLOYEE:**  A barangay employee with elevated privileges.
*   **ADMIN:**  An administrator with full access to all resources and settings.

User roles are stored in the `type` field of the user document in Firestore.

## 12. Response Format

All API responses are in JSON format. Successful responses have the following structure:

```json
{
  "success": true,
  "data": { ... }, // Data relevant to the request
  "message": "Success message" // Optional message
}
```

The `success` field indicates whether the request was successful. The `data` field contains the requested data, if any.  The `message` field provides an optional, human-readable message.
