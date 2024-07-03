# Storefront Backend Project

## Introduction

This project implements a RESTful API for an online storefront, enabling CRUD operations on products, user accounts, and orders. It supports functionalities such as browsing all products, viewing specific product details, managing user authentication, and handling orders. Optional features include displaying top products and filtering products by category. The API ensures secure access to operations requiring authentication, aiming to deliver a scalable and efficient backend solution for an intuitive online shopping experience.
#### Please refer to  REQUIREMENTS.md for API endpoints and data shapes. ####

## Technologies
The application makes use of the following libraries:
- **Postgres** for the database
- **Node/Express** for the application logic
- **dotenv** from npm for managing environment variables
- **db-migrate** from npm for migrations
- **jsonwebtoken** from npm for working with JWTs
- **bcrypt** from npm for encryption
- **jasmine** from npm for testing

## Steps to Setup and Connect to the Database
1. Create a `.env` file in the root folder to store environment variables :<br>
```
# .env file content
POSTGRES_HOST = 127.0.0.1
POSTGRES_DB = store
POSTGRES_TEST_DB = store_test
POSTGRES_USER= store_admin
POSTGRES_PASSWORD= password1234
POSTGRES_PORT=5432
ENV = dev
BCRYPT_PASSWORD = Pikmin4GoodGame
SALT_ROUNDS = 11
TOKEN_SECRET= NintendoSoGood!
```
2. Install Postgres and make sure CLI is also installed.
3. Connect to postgres using CLI comman: ```psql -U postgres``` and if necessary input your password.
4. Create database: <br>```CREATE DATABASE store;```<br>
```CREATE DATABASE store_test;```
5. Create user and grant privileges on Database:<br>
```CREATE USER store_admin WITH PASSWORD 'password1234';```<br>
```GRANT ALL PRIVILEGES ON DATABASE "store" to store_admin;```<br>
```GRANT ALL PRIVILEGES ON DATABASE "store_test" to store_admin;```
6. Grant schema, tables and sequences privileges to user:<br>
Using the postgres super user to connect to 'store' database: ```\c store```, then run: <br>
```GRANT ALL ON SCHEMA public TO store_admin;```<br>
```GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO store_admin;```<br>
```GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO store_admin;```<br>
Follow the same step to grant schema of 'store_test' to store_admin: ```\c store_test```, then run: <br>
```GRANT ALL ON SCHEMA public TO store_admin;```<br>
```GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO store_admin;```<br>
```GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO store_admin;```<br>
7. Install all packages:<br>
```npm install```
8. Install and use db-migrate to do migration:<br>
```npm install -g db-migrate```<br>
```db-migrate up``` <br><br>
**The database will be running on the port `5432`.**

##  Steps to Run the Backend ##
1. Run the backend server: ```npm start```
2. Run tests: ```npm test```<br><br>
**The backend server will be running on the port `3000`.**
