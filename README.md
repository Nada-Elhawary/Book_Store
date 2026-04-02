# Bookstore API

Simple Express + MongoDB API for user authentication and book management.

## Express Technology

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Start the server:

```bash
npm run dev
```

Or:

```bash
npm start
```

## Base URL

```text
http://localhost:5000
```

## Authentication

Protected endpoints require this header:

```http
Authorization: Bearer <token>
```

Admin-only endpoints require a valid token for a user whose `role` is `admin`.

## Data Models

### User

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "user | admin"
}
```

Notes:
- `role` defaults to `user`
- password must be at least 6 characters

### Book

```json
{
  "title": "string",
  "author": "string",
  "availableCopies": 1
}
```

Notes:
- `title` is required
- `author` is required
- `availableCopies` defaults to `1`

### Order

```json
{
  "user": "ObjectId",
  "book": "ObjectId",
  "status": "rented | returned",
  "rentedAt": "Date",
  "returnedAt": "Date"
}
```

Note:
- order endpoints are mounted under `/api/orders`
- `status` defaults to `rented`
- `rentedAt` is set automatically when an order is created
- `returnedAt` is set when the book is returned

## Endpoints

### Health Check

#### `GET /`

Returns a simple status message.

Response:

```json
"API is running..."
```

## User Endpoints

### `GET /api/users`

Returns a small route guide for the user API.

Response:

```json
{
  "register": "POST /api/users/register (JSON: name, email, password)",
  "login": "POST /api/users/login (JSON: email, password)",
  "me": "GET /api/users/me (header: Authorization: Bearer <token>)",
  "adminCheck": "GET /api/users/admin-check (Bearer token, admin only)"
}
```

### `GET /api/users/register`

Method-help endpoint. This route does not register a user.

Response status:
- `405 Method Not Allowed`

### `POST /api/users/register`

Register a new user.

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Success response:
- `201 Created`

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

Common errors:
- `400` if required fields are missing
- `400` if password is shorter than 6 characters
- `400` if email already exists

### `GET /api/users/login`

Method-help endpoint. This route does not log in a user.

Response status:
- `405 Method Not Allowed`

### `POST /api/users/login`

Authenticate a user.

Request body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Success response:
- `200 OK`

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

Common errors:
- `400` if email or password is missing
- `401` if credentials are invalid

### `GET /api/users/me`

Returns the currently authenticated user.

Headers:

```http
Authorization: Bearer <token>
```

Success response:
- `200 OK`

```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

Common errors:
- `401` if token is missing, invalid, or expired
- `404` if the user no longer exists

### `GET /api/users/admin-check`

Checks whether the authenticated user has admin access.

Headers:

```http
Authorization: Bearer <admin_token>
```

Success response:
- `200 OK`

```json
{
  "message": "Admin access granted",
  "user": {
    "id": "user_id",
    "role": "admin"
  }
}
```

Common errors:
- `401` if token is missing, invalid, or expired
- `403` if the user is not an admin

## Book Endpoints

All book routes are mounted under:

```text
/api/books
```

### `GET /api/books`

Get all books.

Success response:
- `200 OK`

```json
{
  "status": 200,
  "message": "All Books Received Successfully",
  "data": [
    {
      "_id": "book_id",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "availableCopies": 4
    }
  ]
}
```

### `POST /api/books`

Create a new book. Admin only.

Headers:

```http
Authorization: Bearer <admin_token>
```

Request body:

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "availableCopies": 4
}
```

Success response:
- `201 Created`

```json
{
  "status": 201,
  "message": "New Book Created Successfully",
  "data": {
    "_id": "book_id",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "availableCopies": 4
  }
}
```

Common errors:
- `401` if token is missing or invalid
- `403` if user is not an admin
- `400` if required fields are missing or invalid

### `GET /api/books/:id`

Get one book by id.

Success response:
- `200 OK`

```json
{
  "status": 200,
  "message": "Singel Book Recieved Successfuly",
  "data": {
    "_id": "book_id",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "availableCopies": 4
  }
}
```

Common errors:
- `404` if the book does not exist
- `400` if the id format is invalid

### `PATCH /api/books/:id`

Update a book by id. Admin only.

Headers:

```http
Authorization: Bearer <admin_token>
```

Request body example:

```json
{
  "availableCopies": 7
}
```

Success response:
- `200 OK`

```json
{
  "status": 200,
  "message": "Book Updated Successfuly",
  "data": {
    "_id": "book_id",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "availableCopies": 7
  }
}
```

Common errors:
- `401` if token is missing or invalid
- `403` if user is not an admin
- `404` if the book does not exist
- `400` if the id or body is invalid

### `DELETE /api/books/:id`

Delete a book by id. Admin only.

Headers:

```http
Authorization: Bearer <admin_token>
```

Success response:
- `200 OK`

```json
{
  "status": 200,
  "message": "Book Deleted Successfuly",
  "data": {
    "_id": "book_id",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "availableCopies": 4
  }
}
```

Common errors:
- `401` if token is missing or invalid
- `403` if user is not an admin
- `404` if the book does not exist
- `400` if the id is invalid

## Order Endpoints

All order routes require a valid Bearer token.

### `POST /api/orders/rent/:bookId`

Create a rental order for a book and decrease `availableCopies` by 1.

Headers:

```http
Authorization: Bearer <token>
```

Success response:
- `201 Created`

```json
{
  "status": 201,
  "message": "Order done successfully",
  "data": {
    "_id": "order_id",
    "user": "user_id",
    "book": "book_id",
    "status": "rented",
    "rentedAt": "2026-04-01T12:00:00.000Z",
    "returnedAt": null
  }
}
```

Common errors:
- `401` if token is missing or invalid
- `404` if the book does not exist
- `400` if there are no available copies

### `PUT /api/orders/return/:orderId`

Return a rented book, mark the order as `returned`, and increase `availableCopies` by 1.

Headers:

```http
Authorization: Bearer <token>
```

Success response:
- `200 OK`

```json
{
  "status": 200,
  "message": "Book returned successfully"
}
```

Common errors:
- `401` if token is missing or invalid
- `404` if the order does not exist
- `400` if the order was already returned

### `GET /api/orders/my-orders`

Get the authenticated user's orders. The `book` field is populated.

Headers:

```http
Authorization: Bearer <token>
```

Success response:
- `201 Created`

```json
{
  "status": 201,
  "message": "Get user order successfully",
  "data": [
    {
      "_id": "order_id",
      "user": "user_id",
      "status": "rented",
      "rentedAt": "2026-04-01T12:00:00.000Z",
      "returnedAt": null,
      "book": {
        "_id": "book_id",
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "availableCopies": 3
      }
    }
  ]
}
```

Common errors:
- `401` if token is missing or invalid

### `GET /api/orders`

Get all orders. In the current code, this route requires authentication but is not restricted to admins.
Both `user` and `book` are populated in the response.

Headers:

```http
Authorization: Bearer <token>
```

Success response:
- `201 Created`

```json
{
  "status": 201,
  "message": "Get All Orders successfully",
  "data": [
    {
      "_id": "order_id",
      "status": "returned",
      "rentedAt": "2026-04-01T12:00:00.000Z",
      "returnedAt": "2026-04-03T15:30:00.000Z",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      "book": {
        "_id": "book_id",
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "availableCopies": 4
      }
    }
  ]
}
```

Common errors:
- `401` if token is missing or invalid

## Error Handling

### Unknown Route

Any undefined route returns:

```json
{
  "message": "Route not found"
}
```

### Auth Errors

Possible auth-related messages include:

- `Not authorized, no token`
- `Not authorized, invalid token`
- `Not authorized, token expired`
- `Access denied: admin role required`

## Important Notes

- order routes are mounted in `app.js` under `/api/orders`
- `GET /api/orders` is currently accessible to any authenticated user because `requireAdmin` is not applied in `routes/orderRoutes.js`
- `JWT_SECRET` must be set or the server exits on startup
