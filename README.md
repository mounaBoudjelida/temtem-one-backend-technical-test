# Products Store Api
Products Store is a RESTful API that give necessary endpoints to manage a product store.

# Features
## 1. Store owner 
* Login
* Create new Product
* Update a product
* Delete a product
* View products (listing and product by id)

## 2. GUEST
* Register
* Login
* Products Store Api


## Requirements
Tools needed to run your project are :
* Nodejs (20.x)
* npm (or yarn)
* NestJS CLI
* MongoDB for database

## Project configuration
Start by cloning this project on your workstation :
```bash
git clone https://github.com/mounaBoudjelida/temtem-one-backend-technical-test.git
```
Next, install all the dependencies of the project :
```bash
cd ./temtem-one-backend-technical-test
npm install
```
Once dependencies are installed, configure your project by creating a new .env.developement file in the root directory, this file  contain the environment variables used for development, please check env.example file. 

## Running the Application
```bash
# Run in development mode
npm run start
# or
yarn start

# Run in watch mode
npm run start:dev
# or
yarn start:dev

# Run in production mode
npm run start:prod
# or
yarn start:prod

```
## API Documentation

This project is using Swagger for documentation, just navigate to the link below to view the API documentation.

```bash
# Swagger
http://localhost:4000/products-stote-api
```

## Contributing
To add a new feature, fix an issue, or do any update on the project, please follow steps below:
1. Fork the project
2. Create your feature branch (git checkout -b YourFeature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin YourFeature)
5. Open a pull request