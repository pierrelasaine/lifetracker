require('dotenv').config()

const app = require('./app')
const config = require('./config')


const port = config.PORT || 3001

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}! 🚀`)
})