const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/visits', require('./routes/visitsRoutes'))


app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
