const mongoose = require("mongoose")
const { MongoMemoryServer } = require('mongo-memory-server')

async function connect(){
    const mongod = await MongoMemoryServer.creat()
    const getUri = mongod.getUri()

    mongoose.set('strictQuery', true)
    const db = mongoose.connect(getUri)
    console.log("Database connected..")
    return db
}

module.exports = connect