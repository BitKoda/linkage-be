# Linkage Back-End

## Table of contents

- [About <a name="about"></a>](#about-)
- [Prerequisites <a name="Prerequisites"></a>](#Prerequisites-)
- [Getting Started <a name="getting-started"></a>](#getting-started-)
- [Testing <a name="testing"></a>](#testing-)
- [API Routes <a name="api-routes"></a>](#api-routes-)

## About <a name="about"></a>

This is a RESTful API for Linkage Back-End database. The database is `MongoDB Atlas`, interacted with via `Mongoose and Express.js`. It contains data on users, visits and passwords, which are accessible via the endpoints provided and appropriate GET, POST, PATCH and DELETE methods. A complete list of endpoints and methods is accessible in the `endpoints.json` file.

Testing was carried out using Jest and Supertest.

API has been hosted with Heroku [here](https://final-project-ukage-be.herokuapp.com/api).

## Prerequisites <a name="Prerequisites"></a>

Please ensure the following are installed:

- node: v17.8.0
- express: 4.17.3,
- mongoose: 6.2.7
- npm: v8.1.2

## Getting Started <a name="getting-started"></a>

To run this project you will need to do the following:

1. Clone this repository onto your local machine.

```
git clone https://github.com/BitKoda/nc-group-project.git

```

2. Navigate inside the folder

```
cd nc-group-project

```

3. Open the directory in your code editor.

```
code . (for VScode)
```

4. Install all dependencies

```
npm install
```

5. Create a **.env** file in order to successfully connect to the two databases locally. Inside, add `PORT=5000`,`MONGO_URI` and `MONGO_TEST` - to connect to test and development databases,`TOKEN_SECRET`- to encript passwords.

6. Finally to run the server locally enter the following command in your terminal:

```
npm start
```

This will run the server on port 9090. All endpoints can be found locally on `http://localhost:5000`.

## Testing <a name="testing"></a>

To test the API navigate to the project directory and enter the following command:

```
npm test
```

## API Routes <a name="api-routes"></a>

```
GET /api/users
```

returns a list of all users

```
GET /api/visits
```

returns a list of all visits

```
GET /api/users/:userId
```

returns a user object from the id requested

```
PATCH /api/users/:userId
```

returns a user object with the updated properties

```
POST /api/auth/signup
```

returns a new user object

```
POST /api/auth/login
```

returns a user object with a unique access token

```
DELETE /api/users/:userId
```

deletes selected user from the array of all users

```
GET /api/users/:userId/visits
```

returns an array of all visits corresponding to a user

```
POST /api/visits
```

returns a new visit object

```
GET /api/visits/:visitId
```

returns a visit object from the id requested

```
DELETE /api/visits/:visitId
```

deletes selected visit from the array of all visits

```
GET /api
```

returns a json object of the path above, with example responses
