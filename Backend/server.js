const dotenv = require('dotenv')
dotenv.config()

const app = require('./src/app.js')
const connectToDb = require('./src/config/database.js')


const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    connectToDb()
    console.log(`server running at port ${PORT}`)
})

module.exports = app
