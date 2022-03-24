const express = require("express");
const dotenv = require("dotenv").config();
//const port = process.env.PORT || 9000;
const app = express();
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = Math.floor(Math.random()*10000)

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/visits', require('./routes/visitsRoutes'))


app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));


app.all('/*', (req, res) => {
    res.status(404).send({message: "Path not found"})
})
module.exports = app;
