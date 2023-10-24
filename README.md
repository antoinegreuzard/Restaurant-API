# Restaurant API

Welcome to the Restaurant API! This API provides endpoints to manage items, categories, and formulas for a restaurant.
It allows you to perform various operations such as creating, reading, updating, and deleting items, categories, and
formulas in the restaurant's menu. Basic authentication is implemented to ensure secure access to the API.

## Getting Started

To get started with the Restaurant API, follow the steps below:

### Prerequisites

Before you begin, make sure you have the following installed:

- Node.js
- MySQL

### Installation

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Set up the MySQL database:

- Create a database named `restapi`.
- Import the database schema from the `database.sql` file in the repository.

4. Configure the database connection in `server.js` if necessary.

### Usage

1. Start the server: `node server.js`.
2. Access the API endpoints using tools like Postman or any HTTP client.

## API Endpoints

### Items

- **GET /items**: Get a list of items. Supports filtering by price and category.
- **GET /items/:id**: Get details of a specific item by ID.
- **POST /items**: Add new items to the menu.
- **PUT /items/:id**: Update details of a specific item by ID.
- **DELETE /items/:id**: Delete an item from the menu by ID.

### Categories

- **GET /categories**: Get a list of categories.
- **GET /categories/:id**: Get details of a specific category by ID.
- **POST /categories**: Add new categories.
- **PUT /categories/:id**: Update details of a specific category by ID.
- **DELETE /categories/:id**: Delete a category by ID.

### Formulas

- **GET /formulas**: Get a list of formulas. Supports filtering by price and category.
- **GET /formulas/:id**: Get details of a specific formula by ID.
- **POST /formulas**: Add new formulas to the menu.
- **PUT /formulas/:id**: Update details of a specific formula by ID.
- **DELETE /formulas/:id**: Delete a formula from the menu by ID.

## Authentication

Basic authentication is implemented for API access. Two user roles are available: `admin` and `client`. Only `admin`
users have access to create, update, and delete operations.

- **Username**: admin, Password: admin (for admin access)
- **Username**: client, Password: client (for client access)

## Error Handling

- 400 Bad Request: Invalid request parameters.
- 401 Unauthorized: Unauthorized access.
- 403 Forbidden: Access forbidden for the current user.
- 404 Not Found: Endpoint or resource not found.
- 500 Internal Server Error: Server-side error occurred.

## Feedback

If you have any feedback or questions, please create an issue or reach out to us. Thank you for using the Restaurant
API!