# API Documentation

## Authentication (`/api/auth`)

| Method | Endpoint       | Auth     | Body Parameters                                                            | Response (Success)                                                         | Response (Error)                                                                       |
| ------ | -------------- | -------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `POST` | `/signup`      |          | `email`, `password`, `firstName`, `lastName`, `phone` (optional), `address` (optional) | `201 Created`: `{"success": true, "data": {"uid": "firebaseGeneratedUserId"}, "message": "User created successfully"}` | `400 Bad Request`: Missing fields.  `500 Internal Server Error`: Firebase/database error. |
| `POST` | `/signin`      |          | `email`, `password`                                                        | `200 OK`: `{"success": true, "data": {"token": "firebaseCustomToken"}, "message": "Sign-in successful"}` | `400 Bad Request`: Missing fields.  `401/500`: Firebase auth error.                   |
| `GET`  | `/profile`     | Required |                                                                            | `200 OK`: `{"success": true, "data": {"user": {...user data...}}, "message": "User profile retrieved successfully"}` | `401 Unauthorized`: Invalid token.  `404 Not Found`: User not found. `500`: Database error. |

## Chat (`/api/chat`)

| Method | Endpoint | Auth     | Body Parameters | Response (Success)                                                         | Response (Error)                                                                            |
| ------ | -------- | -------- | --------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `POST` | `/`       | Required | `message`       | `200 OK`: `{"success": true, "data": {"response": "Chatbot response..."}, "message": "Chat response generated successfully"}` | `400 Bad Request`: Missing `message`. `401`: Invalid token.  `500`: Gemini API/database error. |

## Forms (`/api/forms`)

| Method | Endpoint       | Auth     | Roles             | Body Parameters                                        | Response (Success)                                                                  | Response (Error)                                                                                     |
| ------ | -------------- | -------- | ----------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `POST` | `/`            | Required | `EMPLOYEE`, `ADMIN` | `title`, `description`, `link`, `logoURL` (optional)    | `201 Created`: `{"success": true, "data": {"id": "firestoreDocumentId"}, "message": "Form created successfully"}` | `400 Bad Request`: Missing fields/invalid URL. `401`: Invalid token.  `403`: No permission. `500`: Database error. |
| `GET`  | `/:id`         |          |                   |                                                        | `200 OK`: `{"success": true, "data": {"form": {...form data...}}, "message": "Form retrieved successfully"}` | `404 Not Found`: Form not found.  `500`: Database error.                                          |
| `GET`  | `/`            |          |`EMPLOYEE`, `ADMIN`                   |                                     |  `200 OK`:  `{"success": true, "data":{"forms":[{},{}]}, "message":"Forms retrieved successfully"}`  |`401`: Invalid token.  `403`: No permission. `500`: Database error. |
| `PUT`  | `/:id`         | Required | `EMPLOYEE`, `ADMIN` | `title` (optional), `description` (optional), `link` (optional), `logoURL` (optional) | `200 OK`: `{"success": true, "data": null, "message": "Form updated successfully"}`    | `400 Bad Request`: Invalid URL. `401`: Invalid token.  `403`: No permission.  `404`: Form not found. `500`: Database error. |
| `DELETE` | `/:id`         | Required | `EMPLOYEE`, `ADMIN` |                                                        | `200 OK`: `{"success": true, "data": null, "message": "Form deleted successfully"}`    | `401`: Invalid token.  `403`: No permission.  `404`: Form not found. `500`: Database error.   |

## Messages (`/api/messages`)

| Method | Endpoint            | Auth     | Body Parameters       | Response (Success)                                                                   | Response (Error)                                                                                                      |
| ------ | ------------------- | -------- | --------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/`                 | Required | `ticketId`, `content` | `201 Created`: `{"success": true, "data": {"id": "firestoreMessageId"}, "message": "Message created successfully"}` | `400 Bad Request`: Missing fields.  `401`: Invalid token. `403`: Unauthorized.  `404`: Ticket not found.  `500`: Database error. |
| `GET`  | `/ticket/:ticketId` | Required |                       | `200 OK`: `{"success": true, "data": {"messages": [...messages...]}, "message": "Messages retrieved successfully"}` | `401`: Invalid token.  `403`: Unauthorized.  `404`: Ticket not found.  `500`: Database error.                         |
| `GET`  | `/:id`              | Required |                       | `200 OK`: `{"success": true, "data": {"message": {...message data...}}, "message": "Message retrieved successfully"}` | `401`: Invalid token.  `403`: Unauthorized.  `404`: Message not found. `500`: Database error.                            |
| `PUT`  | `/:id`              | Required | `content`             | `200 OK`: `{"success": true, "data": null, "message": "Message updated successfully"}`    | `400 Bad Request`: Missing `content`. `401`: Invalid token.  `403`: Unauthorized.  `404`: Message not found. `500`: Database error. |
| `DELETE` | `/:id`              | Required |                       | `200 OK`: `{"success": true, "data": null, "message": "Message deleted successfully"}`    | `401`: Invalid token.  `403`: Unauthorized.  `404`: Message not found.  `500`: Database error.                        |

## Pages (`/api/pages`)

| Method | Endpoint       | Auth     | Roles             | Body Parameters                               | Response (Success)                                                                  | Response (Error)                                                                          |
| ------ | -------------- | -------- | ----------------- | --------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `POST` | `/`            | Required | `EMPLOYEE`, `ADMIN` | `slug`, `title`, `content`                    | `201 Created`: `{"success": true, "data": {"id": "firestorePageId"}, "message": "Page created successfully"}` | `400 Bad Request`: Missing fields. `401`: Invalid token.  `403`: No permission. `500`: Database error. |
| `GET`  | `/:slug`       |          |                   |                                               | `200 OK`: `{"success": true, "data": {"page": {...page data...}}, "message": "Page retrieved successfully"}` | `404 Not Found`: Page not found. `500`: Database error.                                    |
| `GET`  | `/`            |      |                       |                                          |      `200 OK`: `{"success": true, "data": {"pages": [...pages...]}, "message": "Page retrieved successfully"}`                                                                         |    `500`: Database error.                                         |
| `PUT`  | `/:slug`       | Required | `EMPLOYEE`, `ADMIN` | `title` (optional), `content` (optional)      | `200 OK`: `{"success": true, "data": null, "message": "Page updated successfully"}`    | `400 Bad Request`: Invalid input.  `401`: Invalid token.  `403`: No permission. `404`: Page not found. `500`: Database error. |
| `DELETE` | `/:slug`       | Required | `EMPLOYEE`, `ADMIN` |                                               | `200 OK`: `{"success": true, "data": null, "message": "Page deleted successfully"}`    | `401`: Invalid token. `403`: No permission.  `404`: Page not found.  `500`: Database error.     |

## Settings (`/api/settings`)

| Method | Endpoint | Auth     | Roles   | Body Parameters                                                 | Response (Success)                                                                                                       | Response (Error)                                                                          |
| ------ | -------- | -------- | ------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `GET`  | `/`      | Required | `ADMIN` |                                                                 | `200 OK`: `{"success": true, "data": {"settings": {...settings data...}}, "message": "Settings retrieved successfully"}` | `401`: Invalid token. `403`: No permission.  `500`: Database error.                           |
| `PUT`  | `/`      | Required | `ADMIN` | `googleGeminiKey`, `facebookPageId`, `facebookAccessToken` | `200 OK`: `{"success": true, "data": null, "message": "Settings updated successfully"}`                                   | `400 Bad Request`: Invalid key. `401`: Invalid token.  `403`: No permission.  `500`: Database error. |

## Tickets (`/api/tickets`)

| Method | Endpoint       | Auth     | Roles            | Body Parameters                                               | Response (Success)                                                                  | Response (Error)                                                                                     |
| ------ | -------------- | -------- | ---------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `POST` | `/`            | Required |                  | `title`, `type`                                                | `201 Created`: `{"success": true, "data": {"id": "firestoreTicketId"}, "message": "Ticket created successfully"}` | `400 Bad Request`: Missing fields.  `401`: Invalid token. `500`: Database error.                  |
| `GET`  | `/:id`         | Required |                  |                                                               | `200 OK`: `{"success": true, "data": {"ticket": {...ticket data...}}, "message": "Ticket retrieved successfully"}` | `401`: Invalid token.  `403`: Unauthorized.  `404`: Ticket not found. `500`: Database error.    |
| `GET`  | `/`            | Required | `EMPLOYEE`, `ADMIN` |                                                               | `200 OK`: `{"success": true, "data": {"tickets": [...tickets...]}, "message": "Tickets retrieved successfully"}` | `401`: Invalid token. `403`: No permission. `500`: Database error.                                  |
| `GET`  | `/my/all`       | Required |                  |                                                               | `200 OK`: `{"success": true, "data": {"tickets": [...tickets...]}, "message": "Tickets retrieved successfully"}`          |`401`: Invalid token. `500`: Database error.        |
| `PUT`  | `/:id`         | Required |                  | `title` (optional), `type` (optional), `status` (optional), `assignedTo` (optional) | `200 OK`: `{"success": true, "data": null, "message": "Ticket updated successfully"}`    | `400 Bad Request`: Invalid `status`. `401`: Invalid token. `403`: Unauthorized.  `404`: Ticket not found. `500`: Database error. |
| `DELETE` | `/:id`         | Required |                  |                                                               | `200 OK`: `{"success": true, "data": null, "message": "Ticket deleted successfully"}`    | `401`: Invalid token. `403`: Unauthorized.  `404`: Ticket not found. `500`: Database error.     |

## Users (`/api/users`)

| Method | Endpoint            | Auth     | Roles             | Body Parameters                                                | Response (Success)                                                                    | Response (Error)                                                                                 |
| ------ | ------------------- | -------- | ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `GET`  | `/:id`              | Required | `EMPLOYEE`, `ADMIN` |                                                                | `200 OK`: `{"success": true, "data": {"user": {...user data...}}, "message": "User retrieved successfully"}` | `401`: Invalid token. `403`: No permission.  `404`: User not found. `500`: Database error.        |
| `GET`  | `/`                 | Required | `ADMIN`           |                                                                | `200 OK`: `{"success": true, "data": {"users": [...users...]}, "message": "Users retrieved successfully"}` | `401`: Invalid token. `403`: No permission. `500`: Database error.                                 |
| `GET` | `/type/resident` | Required | `EMPLOYEE, ADMIN`           |                                         | `200 OK`: `{"success": true, "data": {"residents": [...users...]}, "message": "Users retrieved successfully"}` | `401`: Invalid token. `403`: No permission. `500`: Database error.  |
| `PUT`  | `/:id`              | Required | `ADMIN`           | `firstName` (optional), `lastName` (optional), `phone` (optional), `address` (optional), `type` (optional) | `200 OK`: `{"success": true, "data": null, "message": "User updated successfully"}`      | `400 Bad Request`: Invalid `type`.  `401`: Invalid token. `403`: No permission. `404`: User not found. `500`: Database error. |
| `DELETE` | `/:id`              | Required | `ADMIN`           |                                                                | `200 OK`: `{"success": true, "data": null, "message": "User deleted successfully"}`      | `401`: Invalid token. `403`: No permission.  `404`: User not found. `500`: Database error.      |

## Response Format

| Field     | Description                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `success` | `true` request, `false` error.                                                       |
| `data`    |  data, specific.                                                                   |
| `message` |   message, request.                                                          |

## Error Codes

| Code  | Description                                    |
| ----- | ---------------------------------------------- |
| `400` |  request / missing parameters.                   |
| `401` |   / token invalid / expired.                |
| `403` |   access.                              |
| `404` | resource .                                  |
| `500` |   server error.                                    |

## Roles

| Role       | Description                                    |
| ---------- | ---------------------------------------------- |
| `RESIDENT` | system.                                  |
| `EMPLOYEE` |  privileges.                                       |
| `ADMIN`    |  access  resources  settings.                      |