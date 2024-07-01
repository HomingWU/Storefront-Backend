# API Requirements
The following is the endpoints the API supplys, as well as data shapes.

## API Endpoints
#### Products
- Index '/products' [GET]
- Show (args: product id) '/products/:id' [GET]
- Create [token required] '/products' [POST]
- Delete (args: product id) [token required] '/products/:id' [DELETE]
- Update (args: product id) [token required] '/products/:id' [PUT]
- [OPTIONAL] Top 5 most popular products '/dashboard/top5products' [GET]
- [OPTIONAL] Products by category (args: product category) '/products/category/:category' [GET]

#### Users
- Index [token required] '/users' [GET]
- Show (args: user id) [token required] '/users/:id' [GET]
- Create [token returned] '/users' [POST]
- Delete (args: user id) [token required] '/users/:id' [DELETE]
- Update (args: user id) [token required] '/users/:id' [PUT]
- Authenticate [tokken returned]'/users/authenticate' [POST]

#### Orders
- Index [token required] '/orders' [GET]
- Show (args: order id) [token required] '/orders/:id' [GET]
- Create [token required] '/orders' [POST]
- Update [token required] 'orders/:id' [PUT]
- Delete (args: order id) [token required] '/orders/:id' [DELETE]
- Current Order by user (args: user id)[token required] '/orders/active/:userId' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] '/orders/complete/:userId' [GET]
- Add Products (args: user id, order id)[token required] '/users/:userId/orders/:orderId/products' [POST]


## Data Shapes
#### Product
-  id SERIAL PRIMARY KEY    
- name VARCHAR NOT NULL
- price NUMERIC NOT NULL
- [OPTIONAL] category VARCHAR(50)

#### User
- id SERIAL PRIMARY KEY
- firstName VARCHAR(100) NOT NULL
- lastName VARCHAR(100) NOT NULL
- password VARCHAR(100) NOT NULL

#### Orders
- id SERIAL PRIMARY KEY
- id of each product in the order INTEGER [foreign key to Product table]
- quantity of each product in the order INTEGER NOT NULL
- user_id INTEGER [foreign key to User table]
- status of order (active or complete) VARCHAR(10) NOT NULL

