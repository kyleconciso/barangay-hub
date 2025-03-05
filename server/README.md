
**Auth**

| Method | Endpoint             | Description          | Auth        | Roles | Body                                    |
|--------|----------------------|----------------------|-------------|-------|-----------------------------------------|
| POST   | `/api/auth/signup`   | Signup               |             |       | `email`, `password`, `firstName`, `lastName`, `phone`, `address` |
| POST   | `/api/auth/signin`   | Signin               |             |       | `email`, `password`                     |
| GET    | `/api/auth/profile`  | Profile              | Required    |       |                                         |

<br></br>
**Chat**

| Method | Endpoint     | Description   | Auth     | Roles | Body      |
|--------|--------------|---------------|----------|-------|-----------|
| POST   | `/api/chat` | Chat Gemini   | Required |       | `message` |

<br></br>
**Forms**

| Method | Endpoint        | Description      | Auth        | Roles             | Body                                    |
|--------|-----------------|------------------|-------------|-------------------|-----------------------------------------|
| POST   | `/api/forms`    | Create form      | Required    | EMPLOYEE, ADMIN   | `title`, `description`, `link`, `logoURL` |
| GET    | `/api/forms/:id` | Get form by ID   |             |                   |                                         |
| GET    | `/api/forms`    | Get all forms    | Required    | EMPLOYEE, ADMIN   |                                         |
| PUT    | `/api/forms/:id` | Update form      | Required    | EMPLOYEE, ADMIN   | `title`, `description`, `link`, `logoURL` (optional) |
| DELETE | `/api/forms/:id`| Delete form      | Required    | EMPLOYEE, ADMIN   |                                         |

<br></br>
**Messages**

| Method | Endpoint                     | Description              | Auth        | Roles | Body                  |
|--------|------------------------------|--------------------------|-------------|-------|-----------------------|
| POST   | `/api/messages`             | Create message           | Required    |       | `ticketId`, `content` |
| GET    | `/api/messages/ticket/:ticketId` | Get messages by ticket     | Required    |       |                       |
| GET    | `/api/messages/:id`          | Get message by ID        | Required    |       |                       |
| PUT    | `/api/messages/:id`          | Update message           | Required    |       | `content`             |
| DELETE | `/api/messages/:id`         | Delete message           | Required    |       |                       |

<br></br>
**Pages**

| Method | Endpoint          | Description      | Auth        | Roles             | Body                      |
|--------|-------------------|------------------|-------------|-------------------|---------------------------|
| POST   | `/api/pages`      | Create page      | Required    | EMPLOYEE, ADMIN   | `slug`, `title`, `content`|
| GET    | `/api/pages/:slug` | Get page by slug |             |                   |                           |
| GET    | `/api/pages`      | Get all pages    |             |                   |                           |
| PUT    | `/api/pages/:slug` | Update page      | Required    | EMPLOYEE, ADMIN   | `title`, `content` (optional) |
| DELETE | `/api/pages/:slug`| Delete page      | Required    | EMPLOYEE, ADMIN   |                           |

<br></br>
**Settings**

| Method | Endpoint        | Description      | Auth        | Roles   | Body                                                        |
|--------|-----------------|------------------|-------------|---------|-------------------------------------------------------------|
| GET    | `/api/settings` | Get settings     | Required    | ADMIN   |                                                             |
| PUT    | `/api/settings` | Update settings  | Required    | ADMIN   | `googleGeminiKey`, `facebookPageId`, `facebookAccessToken` |

<br></br>
**Tickets**

| Method | Endpoint             | Description          | Auth        | Roles             | Body                        |
|--------|----------------------|----------------------|-------------|-------------------|-----------------------------|
| POST   | `/api/tickets`      | Create ticket        | Required    |                   | `title`, `type`               |
| GET    | `/api/tickets/:id`   | Get ticket by ID     | Required    |                   |                             |
| GET    | `/api/tickets`      | Get all tickets      | Required    | EMPLOYEE, ADMIN   |                             |
| GET    | `/api/tickets/my/all`| Get user tickets     | Required    |                   |                             |
| PUT    | `/api/tickets/:id`   | Update ticket        | Required    |                   | `title`, `type`, `status`, `assignedTo` (optional) |
| DELETE | `/api/tickets/:id`  | Delete ticket        | Required    |                   |                             |

<br></br>
**Users**

| Method | Endpoint                 | Description      | Auth        | Roles             | Body                                                 |
|--------|--------------------------|------------------|-------------|-------------------|------------------------------------------------------|
| GET    | `/api/users/:id`         | Get user by ID   | Required    | EMPLOYEE, ADMIN   |                                                      |
| GET    | `/api/users`            | Get all users    | Required    | ADMIN             |                                                      |
| GET    | `/api/users/type/resident`| Get residents    | Required    | EMPLOYEE, ADMIN   |                                                      |
| PUT    | `/api/users/:id`         | Update user      | Required    | ADMIN             | `firstName`, `lastName`, `phone`, `address`, `type` (optional) |
| DELETE | `/api/users/:id`        | Delete user      | Required    | ADMIN             |                                                      |