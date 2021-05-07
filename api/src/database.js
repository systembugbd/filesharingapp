import { MongoClient } from 'mongodb'


const uri = "mongodb+srv://nadim:Nadims@4211@storages.blqnk.mongodb.net/filesharingapp?retryWrites=true&w=majority";

// Connect using the connection string
async function dbConnect(app, callback) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect()
    app.set('db', client)

    callback(client)

}
module.exports = dbConnect