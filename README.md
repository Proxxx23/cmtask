## Prerequisites

- Node.js (v18.x or higher)
- npm

## Installation

1. **Clone**

   ```bash
   git clone https://github.com/Proxxx23/cmugtask
    ```
   
2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Build**

    ```bash
    npm run build
    ```
   
4. **Run**

    ```bash
    npm start
    ```
    or
    ```bash
    npm run dev
    ```

5. **Tests**

    ```bash
    npm t
    ```
   
6. **Endpoints List (Please, use a file exported from Postman)**

    All endpoints are "open", no need for authentication.

- **POST** `/orders` - Create a new order
- **GET** `/products` - List all products
- **POST** `/products` - Create new product
- **POST** `/products/:uuid/restock` - Change stock level of a product
- **POST** `/products/:uuid/sell` - Sell a product

7. **Database**

    The database is a simple SQLite file located at `db/database`.




   

   
