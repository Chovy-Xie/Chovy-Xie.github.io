# iTea E-commerce Application

A web application for ordering tea beverages online.

## Project Structure

- **backend/**: Node.js Express server with SQLite database
- **database/**: SQLite database file and schema
- **public/**: Static frontend files
- **frontend/**: Source frontend files

## Setup Instructions

### Prerequisites

- Node.js v12 or higher
- NPM v6 or higher

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd term-project
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

   **Note for Windows users with PowerShell restrictions**:
   If you encounter errors related to execution policy when using npm, you can:
   - Run PowerShell as Administrator and execute: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
   - Alternatively, use Command Prompt (cmd.exe) instead of PowerShell
   - Or use the Windows Terminal with CMD as the selected profile

### Database Initialization

The application includes an initialization script that creates the database schema and populates it with sample data:

```
cd backend
node init-db.js
```

This script will:
1. Create the SQLite database file at `database/itea.db`
2. Create tables for users, categories, products, carts, and cart items
3. Insert sample data for categories and products

### Running the Application

Start the server:

```
cd backend
node server.js
```

The server will start on http://localhost:3000

Alternatively, use the provided scripts:
- Windows: Run `start-app.bat`
- macOS/Linux: Run `./start-app.sh` (you may need to make it executable with `chmod +x start-app.sh`)

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search?q=term` - Search products
- `GET /api/products/category/:id` - Get products by category
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `POST /api/products/bulk` - Bulk upload products

### Categories

- `GET /api/categories` - Get all categories

### Cart

- `GET /api/cart/:user_id` - Get user's cart
- `POST /api/cart/:user_id/add` - Add item to cart
- `PUT /api/cart/item/:cart_product_id` - Update cart item quantity
- `DELETE /api/cart/item/:cart_product_id` - Remove item from cart
- `POST /api/cart/:user_id/checkout` - Checkout (complete) cart

### Uploads

- `POST /api/upload/json` - Upload products from JSON
- `POST /api/upload/image` - Upload product image

## Testing

To test the API endpoints, run:

```
cd backend
node test-api.js
```

This will test all API endpoints and display the results in the console.

For manual testing, you can use Thunder Client or Postman to make requests to the API endpoints.

## Project Architecture

- **MVC Pattern**:
  - **Models**: Handle database operations (`models/`)
  - **Views**: Frontend code (`public/`)
  - **Controllers**: Handle request processing (`controllers/`)

- **Database Schema**:
  - Users: Customer accounts
  - Categories: Product categories
  - Products: Tea products
  - Carts: Shopping carts
  - Cart Products: Products in carts

## Troubleshooting

### Common Issues

- **EADDRINUSE Error**: The port 3000 is already in use. Stop other servers or change the port in `server.js`.
- **Database Errors**: Ensure the database is initialized with `node init-db.js`.
- **Module Not Found**: Run `npm install` in the backend directory.
- **PowerShell Execution Policy**: If you encounter errors with npm in PowerShell, try using Command Prompt instead, or adjust your PowerShell execution policy.

## License

This project is part of a course assignment.