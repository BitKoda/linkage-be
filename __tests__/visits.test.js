const request = require("supertest")
const mongoose = require('mongoose')
const connectDB = require('../backend/config/db')
// require('dotenv').config({ path: '../.env' });
const dotenv = require('dotenv').config()
const colors = require('colors')

//connectDB()

beforeEach(() => {
connectDB()
    //console.log(mongoose.connection)
})
afterEach(() => {
    return mongoose.connection.close()
})
describe('GET /api/visits/', () => {
    test('should  ', () => {
        
    });
});