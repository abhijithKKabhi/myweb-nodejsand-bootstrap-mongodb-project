const mongoClient = require('mongodb').MongoClient
const state = {
    db: null
}
module.exports.connect = (done)=> {
    const url = 'mongodb://0.0.0.0:27017/'
    const dbName = 'myWebDb'

    mongoClient.connect(url, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbName)
        done()
    })
}
module.exports.get = () => {
    return state.db
}
