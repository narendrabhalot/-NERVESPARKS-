
const { MongoClient } = require("mongodb");
const uri = 'mongodb+srv://Narendrapatidar:cV2gO8n0jzcU6PFK@cluster0.hxlgz.mongodb.net/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connect = async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = {
    connect,
    db: client.db('nervesparks')
}